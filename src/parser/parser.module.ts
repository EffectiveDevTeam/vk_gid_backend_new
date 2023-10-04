import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';
import { ParserService } from './parser.service';
import { TaskEntity } from 'src/tasks/entities';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
    VKModule,
  ],
  controllers: [],
  providers: [ParserService],
})
export class ParserModule {}
