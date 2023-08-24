import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsIn, IsString } from 'class-validator';
import { ColorsAllEnum } from 'src/market/enums';

export class CreateCustomAvatarDto {
  @ApiProperty()
  @IsHexColor()
  @IsIn(ColorsAllEnum)
  color: string;
  
  @ApiProperty()
  @IsString()
  icon_name: string;
}
