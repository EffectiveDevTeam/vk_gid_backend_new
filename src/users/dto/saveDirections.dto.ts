import { ApiProperty } from '@nestjs/swagger';
import { DirectionsEnum } from '../enums';
import { ArrayMaxSize } from 'class-validator';

export class SaveDirectionsDto {
  @ApiProperty()
  @ArrayMaxSize(5, {
    message: 'Прикрепите не больше 5 направлений | directions',
  })
  directions: DirectionsEnum[];
}
