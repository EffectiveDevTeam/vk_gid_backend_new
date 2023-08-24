import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsIn } from 'class-validator';
import { ColorsAllEnum } from 'src/market/enums';

export class BuyColorDto {
  @ApiProperty()
  @IsHexColor()
  @IsIn(ColorsAllEnum)
  color: string;

}
