import { ApiProperty } from '@nestjs/swagger';
import { DirectionsEnum } from '../enums';

export class SaveDirectionsDto {
  @ApiProperty()
  directions: DirectionsEnum[];
}
