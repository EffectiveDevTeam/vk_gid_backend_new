import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class giveAchievementDto {
  @ApiProperty()
  @IsNumber()
  vk_id: number;

  @ApiProperty()
  @IsNumber()
  achievement_id: number;

}
