import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DepartmentsEnum } from '../enums';

export class AddNewMemberDto {
  @ApiProperty({ description: 'Ссылка на сотрудника' })
  link: string;

  @ApiProperty({ enum: DepartmentsEnum })
  @IsEnum(DepartmentsEnum)
  department: DepartmentsEnum;

  @ApiProperty({ description: 'Выдать промокод на 20 голосов?' })
  isPromo: boolean;

  @ApiProperty({ description: 'Назначить модератором' })
  isModer: boolean;
}
