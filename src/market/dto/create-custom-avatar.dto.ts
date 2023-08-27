import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCustomAvatarDto {
  @ApiProperty()
  @IsString()
  icon_name: string;
}
