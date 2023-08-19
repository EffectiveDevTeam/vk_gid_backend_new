import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [ConfigModule, VKModule, PrismaModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [],
})
export class TasksModule {}
