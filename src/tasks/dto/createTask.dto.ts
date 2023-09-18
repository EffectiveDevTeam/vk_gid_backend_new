import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';
import { MaterialTypesEnum } from '../enums';

export class CreateTaskDto {
  @ApiProperty({ enum: MaterialTypesEnum })
  @IsEnum(MaterialTypesEnum, {
    message: 'Неизвестный тип публикации | taskType',
  })
  taskType: MaterialTypesEnum;

  @ApiProperty({ description: 'Описание задачи' })
  @Length(1, 1000, { message: 'Длина описания не более 1000 | text' })
  @IsString({ message: 'Вы не заполнили описание | text' })
  text: string;

  @ApiProperty({ description: 'Прикрепляемые файлы' })
  @IsArray({ message: 'Вы не прикрепили файлы | filesHash' })
  @ArrayMaxSize(10, {
    message: 'Прикрепите  не больше 10 файлов | filesHash',
  })
  @ArrayMinSize(1, {
    message: 'Прикрепите хотя бы один файл | filesHash',
  })
  filesHash: string[];
}
