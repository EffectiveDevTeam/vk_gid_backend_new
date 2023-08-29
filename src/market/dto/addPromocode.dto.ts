import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { ProductsEnum } from '../enums';

export class AddPromocodeDto {
  @ApiProperty()
  @IsString()
  @Matches(/^([a-z0-9]{4})-\1-\1-\1$/iu, {
    message: 'Недопустимый формат промокода',
  })
  promocode: string;

  @ApiProperty({ enum: ProductsEnum })
  @IsEnum(ProductsEnum, {
    message: 'Неизвестный продукт | productType',
  })
  productType: ProductsEnum;
}
