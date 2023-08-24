import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConcatUsersType, VKService } from '@app/vk';
import { UserEntity } from 'src/users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { TaskEntity } from './entities';
import { ActionsTaskEnum, MaterialTypesEnum, TaskStatusEnum } from './enums';
import { FileEntity } from 'src/storage/entities';
import { HttpMessagesEnum, RoleEnum, Roles } from '@app/core';

@Injectable()
export class TasksService {
  constructor(
    private readonly configService: ConfigService,
    private vkService: VKService,
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>,
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

  async getTasks() {
    const currentTasks = await this.tasksRepository.findBy({
      status: LessThan(TaskStatusEnum.COMPLETED),
    });
    const complettedTasks = await this.tasksRepository.find({
      where: {
        status: TaskStatusEnum.COMPLETED,
      },
      order: { completed_at: 'DESC' },
      take: 10,
    });
    const allTasks = [...currentTasks, ...complettedTasks];

    const users_ids = this.getUsersVkIdsFromTasks(allTasks);
    return this.vkService.concatUserObject(
      { currentTasks, complettedTasks },
      users_ids,
    );
  }

  async getModerationTasks() {
    const tasks = await this.tasksRepository.find({
      where: {
        status: TaskStatusEnum.IN_MODERATE,
      },
      take: 100,
    });
    const users_ids = this.getUsersVkIdsFromTasks(tasks);
    return this.vkService.concatUserObject(tasks, users_ids);
  }

  async createTask(
    user: UserEntity,
    taskType: MaterialTypesEnum,
    text: string,
    filesHash: string[],
  ) {
    const files = await this.filesRepository.findBy({ hash: In(filesHash) });
    await this.filesRepository.update({ hash: In(filesHash) }, { saved: true });
    const data = {
      material_type: taskType,
      text,
      filesIds: files,
      author: user,
    };
    return this.tasksRepository.save(data);
  }
  async takeTask(user: UserEntity, taskId: number) {
    const task = await this.getTaskOrException(taskId);
    if (task.status !== TaskStatusEnum.FREE)
      throw new ForbiddenException(HttpMessagesEnum.TASK_ALREADY_IN_WORK);

    const currentUserTasksInWork = await this.tasksRepository.findBy({
      completed_by: user,
      status: TaskStatusEnum.IN_WORK,
    });
    if (!currentUserTasksInWork)
      throw new ForbiddenException(HttpMessagesEnum.TASK_USER_IS_BUSY);

    task.status = TaskStatusEnum.IN_WORK;

    return this.tasksRepository.save(task);
  }

  @Roles(RoleEnum.USER)
  async sendTaskToModerate(
    user: UserEntity,
    taskId: number,
    moderated_link: string,
  ) {
    const task = await this.getTaskOrException(taskId);

    if (task.status !== TaskStatusEnum.IN_WORK)
      throw new ForbiddenException(
        HttpMessagesEnum.TASK_METHOD_UNAVALIBLE_FOR_STATUS,
      );

    if (task.completed_by !== user)
      throw new ForbiddenException(HttpMessagesEnum.FORBIDDEN_OBJECT);

    task.status = TaskStatusEnum.IN_MODERATE;
    task.moderated_link = moderated_link;

    return this.tasksRepository.save(task);
  }

  @Roles(RoleEnum.MODERATOR)
  async moderateTask(taskId: number, action: ActionsTaskEnum) {
    const task = await this.getTaskOrException(taskId);

    switch (action) {
      case ActionsTaskEnum.APPROVE:
        task.status = TaskStatusEnum.COMPLETED;
        break;
      case ActionsTaskEnum.DELETE:
        task.status = TaskStatusEnum.FREE;
        task.moderated_link = '';
        task.completed_by = null;
    }
    return this.tasksRepository.save(task);
  }

  async getTaskOrException(taskId: number) {
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(HttpMessagesEnum.TASK_NOT_FOUND);
    return task;
  }
}
