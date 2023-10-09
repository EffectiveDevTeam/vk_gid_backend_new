import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities';
import { ConfigModule } from '@nestjs/config';
import { AchievementsService } from './achievements.service';
import { AchievementEntity, ExistAchievementEntity } from './entities';
import { SheduledAchievementsService } from './sheduled/sheduled.service';
import { AchievementsController } from './achievements.controller';
import { VKModule } from '@app/vk';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      UserEntity,
      AchievementEntity,
      ExistAchievementEntity,
    ]),
    VKModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, SheduledAchievementsService],
  exports: [TypeOrmModule],
})
export class AchievementsModule {}
