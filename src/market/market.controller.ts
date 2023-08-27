import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@ApiTags('Маркет')
@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    private readonly configService: ConfigService,
  ) {}

  @Get('getPrices')
  @ApiOperation({ summary: 'Получить актуальные цены на товары' })
  async getPrices() {
    return this.marketService.getPrices();
  }
}
