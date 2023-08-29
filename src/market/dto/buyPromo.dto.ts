import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProductsEnum } from '../enums';

export class BuyPromocodeDto {
  @ApiProperty({ enum: ProductsEnum })
  @IsEnum(ProductsEnum, {
    message: 'Неизвестный продукт | productType',
  })
  productType: ProductsEnum;
}
