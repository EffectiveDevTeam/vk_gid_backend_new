import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VKService } from '@app/vk';
import { UserEntity } from 'src/users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TaskEntity } from './entities';
import { MaterialTypesEnum, TaskStatusEnum } from './enums';
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

  @Roles(RoleEnum.MODERATOR)
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
  @Roles(RoleEnum.USER)
  async takeTask(user: UserEntity, taskId: number) {
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(HttpMessagesEnum.TASK_NOT_FOUND);
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
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(HttpMessagesEnum.TASK_NOT_FOUND);

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
  async moderateTask(user: UserEntity, taskId: number) {}

  async getTaskOrException(taskId: number) {
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(HttpMessagesEnum.TASK_NOT_FOUND);
    return task;
  }
}
