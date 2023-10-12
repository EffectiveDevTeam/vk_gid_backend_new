import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class SendTaskToModerateDto {
  @ApiProperty({ description: 'ID задачи' })
  taskId: number;

  @ApiProperty({ description: 'Ссылка на материал' })
  @IsString()
  @Matches(/^https:\/\/.+\..+([\/])?(.*?)$/iu, {
    message: 'Недопустимый формат ссылки | link',
  })
  link: string;
}
