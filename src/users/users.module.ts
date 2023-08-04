import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';

@Module({
  imports: [ConfigModule, UsersService, VKModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
