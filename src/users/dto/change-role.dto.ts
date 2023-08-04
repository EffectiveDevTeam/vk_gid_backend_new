import { RoleEnum } from '@app/core/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ChangeUserRoleDto {
  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
