import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendTaskToModerateDto {
  @ApiProperty({ description: 'ID задачи' })
  taskId: number;

  @ApiProperty({ description: 'Ссылка на материал' })
  @IsString()
  link: string;
}
