import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ActionsTaskEnum } from '../enums';

export class ModerateTaskDto {
  @ApiProperty({ description: 'ID задачи' })
  taskId: number;

  @ApiProperty({ enum: ActionsTaskEnum })
  @IsEnum(ActionsTaskEnum, {
    message: 'Неизвестный тип операции | taskType',
  })
  action: ActionsTaskEnum;
}
