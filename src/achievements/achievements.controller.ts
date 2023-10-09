import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, User } from '@app/core/decorators';
import { RoleEnum } from '@app/core/enums';

import { getByIdDto, giveAchievementDto } from './dto';
import { AchievementsService } from './achievements.service';
import { UserEntity } from 'src/users/entities';
import { PUBLIC_ACHIEVEMENTS_IDS } from './constants';

@ApiBearerAuth()
@ApiTags('Достижения')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementService: AchievementsService) {}

  @Post('give')
  @ApiOperation({ summary: 'Вручную выдать достижение пользователю' })
  @Roles(RoleEnum.ADMIN)
  async getSelf(@Body() body: giveAchievementDto) {
    return this.achievementService.giveAchievement(body);
  }

  @Get('getSelf')
  @ApiOperation({ summary: 'Получить информацию о своих достижениях' })
  @Roles(RoleEnum.REDACTOR, RoleEnum.ADMIN)
  async getAchievements(@User() user: UserEntity) {
    return this.achievementService.getAchievement(user);
  }

  @Post('getById')
  @ApiOperation({ summary: 'Получить информацию о достижении' })
  @Roles(RoleEnum.REDACTOR, RoleEnum.ADMIN)
  async getById(@User() user: UserEntity, @Body() body: getByIdDto) {
    return this.achievementService.getById(user, body.id);
  }

  @Post('easterEggPublicOpen')
  @ApiOperation({ summary: 'Получить информацию о достижении' })
  @Roles(RoleEnum.REDACTOR, RoleEnum.ADMIN)
  async easterEggPublicOpen(@User() user: UserEntity, @Body() body: getByIdDto) {
    if(!PUBLIC_ACHIEVEMENTS_IDS.includes(body.id)) throw new ForbiddenException('Только публичные пасхалки');
    return this.achievementService.easterEggPublicOpen(user, body.id);
  }
}
