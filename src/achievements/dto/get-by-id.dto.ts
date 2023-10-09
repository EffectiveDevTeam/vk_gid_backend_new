import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class getByIdDto {
  @ApiProperty()
  @IsNumber()
  id: number;

}
