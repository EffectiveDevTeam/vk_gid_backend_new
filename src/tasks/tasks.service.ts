import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConcatUsersType, VKService } from '@app/vk';
import { UserEntity } from 'src/users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Like, Repository } from 'typeorm';
import { TaskEntity } from './entities';
import { ActionsTaskEnum, MaterialTypesEnum, TaskStatusEnum } from './enums';
import { HttpMessagesEnum } from '@app/core';
import { StorageService } from 'src/storage/storage.service';
import { getTime } from '@app/utils';
import { MarketService } from 'src/market/market.service';
import { MoneyOperationsEnum, ProductsEnum } from 'src/market/enums';
import { TasksPricesEnum } from './enums/tasksPrice.enum';

@Injectable()
export class TasksService {
  constructor(
    private vkService: VKService,
    private storageService: StorageService,
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    private readonly marketService: MarketService,
  ) {}

  getUsersVkIdsFromTasks(tasks: TaskEntity[]): number[] {
    const users_ids = [];
    for (const task of tasks) {
      users_ids.push(task.author.vk_id);
      users_ids.push(task.completed_by?.vk_id);
    }
    return users_ids;
  }

  async getTask(taskId: number): Promise<ConcatUsersType<TaskEntity>> {
    const task = await this.getTaskOrException(taskId);

    return this.vkService.concatUserObject<TaskEntity>(task, [
      task.author.vk_id,
      task.completed_by?.vk_id,
    ]);
  }

  async getTasks(user: UserEntity, isMy = false, search = '') {
    const currentTasks = await this.tasksRepository.findBy({
      status: LessThan(TaskStatusEnum.COMPLETED),
      completed_by: { vk_id: isMy ? user.vk_id : undefined },
      text: Like(`%${search}%`),
    });
    const complettedTasks = await this.tasksRepository.find({
      where: {
        status: TaskStatusEnum.COMPLETED,
        completed_by: { vk_id: isMy ? user.vk_id : undefined },
        text: Like(`%${search}%`),
      },
      relations: { author: true, completed_by: true },
      order: { completed_at: 'DESC' },
      take: 10,
    });
    const allTasks = [...currentTasks, ...complettedTasks];

    const users_ids = this.getUsersVkIdsFromTasks(allTasks);
    return this.vkService.concatUserObject(
      { items: allTasks, bucketPath: this.storageService.bucketPath },
      users_ids,
    );
  }

  async getModerationTasks() {
    const tasks = await this.tasksRepository.find({
      where: {
        status: TaskStatusEnum.IN_MODERATE,
      },
      take: 100,
      relations: { completed_by: true },
    });
    const users_ids = this.getUsersVkIdsFromTasks(tasks);
    return this.vkService.concatUserObject(
      { items: tasks, bucketPath: this.storageService.bucketPath },
      users_ids,
    );
  }

  async createTask(
    user: UserEntity,
    taskType: MaterialTypesEnum,
    text: string,
    filesHash: string[],
  ) {
    const files = await this.storageService.getFilesByHash(filesHash);
    for (const file of files) {
      console.log(await this.storageService.save(user, file.hash));
    }
    const data = {
      material_type: taskType,
      text,
      files: files,
      author: user,
      created_at: getTime(),
    };
    return this.tasksRepository.save(data);
  }
  async takeTask(user: UserEntity, taskId: number): Promise<TaskEntity> {
    const task = await this.getTaskOrException(taskId);
    if (task.status !== TaskStatusEnum.FREE)
      throw new ForbiddenException(HttpMessagesEnum.TASK_ALREADY_IN_WORK);

    const currentUserTasksInWork = await this.tasksRepository.findBy({
      completed_by: { vk_id: user.vk_id },
      status: TaskStatusEnum.IN_WORK,
    });
    if (currentUserTasksInWork.length)
      throw new ForbiddenException(HttpMessagesEnum.TASK_USER_IS_BUSY);

    task.status = TaskStatusEnum.IN_WORK;
    task.completed_by = user;

    return this.tasksRepository.save(task);
  }

  async sendTaskToModerate(
    user: UserEntity,
    taskId: number,
    moderated_link: string,
  ): Promise<TaskEntity> {
    const task = await this.getTaskOrException(taskId);

    if (task.status !== TaskStatusEnum.IN_WORK)
      throw new ForbiddenException(
        HttpMessagesEnum.TASK_METHOD_UNAVALIBLE_FOR_STATUS,
      );
    if (task.completed_by.vk_id !== user.vk_id)
      throw new ForbiddenException(HttpMessagesEnum.FORBIDDEN_OBJECT);

    task.status = TaskStatusEnum.IN_MODERATE;
    task.moderated_link = moderated_link;
    task.completed_at = getTime();

    return this.tasksRepository.save(task);
  }

  async moderateTask(taskId: number, action: ActionsTaskEnum) {
    const task = await this.getTaskOrException(taskId);

    switch (action) {
      case ActionsTaskEnum.APPROVE:
        task.status = TaskStatusEnum.COMPLETED;
        task.completed_at = getTime();
        this.marketService.manageUserMoney(
          task.completed_by,
          ProductsEnum.VOICES_20,
          MoneyOperationsEnum.ADDITION,
          TasksPricesEnum[task.material_type],
          task.material_type,
        );
        break;
      case ActionsTaskEnum.DELETE:
        task.status = TaskStatusEnum.FREE;
        task.moderated_link = '';
        task.completed_by = null;
        task.completed_at = 0;
    }
    return this.tasksRepository.save(task);
  }

  async getTaskOrException(taskId: number) {
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(HttpMessagesEnum.TASK_NOT_FOUND);
    return { ...task, bucketPath: this.storageService.bucketPath };
  }
}
