import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, Length } from 'class-validator';
import { MaterialTypesEnum } from '../enums';

export class CreateTaskDto {
  @ApiProperty({ enum: MaterialTypesEnum })
  @IsEnum(MaterialTypesEnum, {
    message: 'Неизвестный тип публикации | taskType',
  })
  taskType: MaterialTypesEnum;

  @ApiProperty({ description: 'Описание задачи' })
  text: string;

  @ApiProperty({ description: 'Прикрепляемые файлы' })
  @IsArray({ message: 'Ошибка массива | filesHash' })
  @Length(1, 10, {
    message: 'Прикрепите хотя бы один файл или не больше 10 | filesIds',
  })
  filesHash: string[];
}
