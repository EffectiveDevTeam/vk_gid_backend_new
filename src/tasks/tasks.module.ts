import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    ConfigModule,
    VKModule,
    StorageModule,
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [],
})
export class TasksModule {}
