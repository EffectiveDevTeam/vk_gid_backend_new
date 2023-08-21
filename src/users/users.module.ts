import { Module } from '@nestjs/common';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { VKModule } from '@app/vk';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [ConfigModule, VKModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}