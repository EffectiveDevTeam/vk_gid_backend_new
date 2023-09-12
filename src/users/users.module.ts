import { Module } from '@nestjs/common';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DirectionsEntity,
  DirectionsSelectedEntity,
  UserEntity,
} from './entities';

@Module({
  imports: [
    ConfigModule,
    VKModule,
    TypeOrmModule.forFeature([
      UserEntity,
      DirectionsEntity,
      DirectionsSelectedEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
