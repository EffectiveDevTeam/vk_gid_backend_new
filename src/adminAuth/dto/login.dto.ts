import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  password: string;
}
