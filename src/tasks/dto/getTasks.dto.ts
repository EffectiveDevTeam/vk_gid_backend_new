import { OnlyStringsAndNumbersRegex } from '@app/core/constants/regex.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches } from 'class-validator';

export class GetTasksDto {
  @ApiProperty({ description: 'Отображать только мои задачи' })
  @IsBoolean({ message: 'Укажите булево значение | isMy' })
  isMy: boolean;

  @ApiProperty({ description: 'Строка поиска по текстам задач' })
  @IsString()
  @Matches(OnlyStringsAndNumbersRegex, {
    message: 'Используйте только цифры и алфавит | search',
  })
  search: string;
}
