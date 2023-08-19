import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, Length } from 'class-validator';
import { TaskTypesEnum } from '../enums';

export class CreateTaskDto {
  @ApiProperty({ enum: TaskTypesEnum })
  @IsEnum(TaskTypesEnum, { message: 'Неизвестный тип публикации | taskType' })
  taskType: TaskTypesEnum;

  @ApiProperty({ description: 'Описание задачи' })
  text: string;

  @ApiProperty({ description: 'Прикрепляемые файлы' })
  @IsArray({ message: 'Ошибка массива | filesIds' })
  @Length(1, 10, {
    message: 'Прикрепите хотя бы один файл или не больше 10 | filesIds',
  })
  filesIds: number[];
}
