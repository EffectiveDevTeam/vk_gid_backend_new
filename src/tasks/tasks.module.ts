import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities';
import { StorageModule } from 'src/storage/storage.module';
import { MarketModule } from 'src/market/market.module';

@Module({
  imports: [
    ConfigModule,
    VKModule,
    StorageModule,
    MarketModule,
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [],
})
export class TasksModule {}
