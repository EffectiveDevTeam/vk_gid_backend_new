import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/prisma';
import { VKService } from '@app/vk';
import { UserEntity } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly configService: ConfigService,
    private vkService: VKService,
    private prisma: PrismaService,
  ) {}

  async createTask(
    user: UserEntity,
    taskType: any,
    text: string,
    filesIds: number[],
  ) {
    const data = {
      material_type: taskType,
      text,
      files: filesIds,

    };
    await this.prisma.taskEntity.create({ data });
  }
}
