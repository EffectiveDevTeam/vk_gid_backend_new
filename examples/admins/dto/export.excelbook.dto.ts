import { PeriodsEnum } from '@app/core/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

export class ExportExcelBookDto {
  @ApiProperty({ description: 'Имя пользователя', enum: PeriodsEnum })
  @IsEnum(PeriodsEnum)
  period: PeriodsEnum;

  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  password: string;
}
