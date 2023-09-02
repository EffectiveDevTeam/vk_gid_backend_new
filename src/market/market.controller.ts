import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { RoleEnum, Roles, User } from '@app/core';
import { UserEntity } from 'src/users/entities';
import { AddPromocodeDto, BuyPromocodeDto } from './dto';

@ApiBearerAuth()
@ApiTags('Маркет')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('getHistory')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Получить историю трат' })
  async getHistory(@User() user: UserEntity) {
    return this.marketService.getHistory(user);
  }

  @Get('getPrices')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Получить актуальные цены на товары' })
  async getPrices() {
    return this.marketService.getPrices();
  }

  @Post('addPromo')
  @ApiOperation({ summary: 'Добавить новый промокод' })
  @Roles(RoleEnum.MODERATOR)
  async addPromo(@User() user: UserEntity, @Body() body: AddPromocodeDto) {
    const { promocode, productType } = body;
    return this.marketService.addPromo(user, promocode, productType);
  }

  @Post('buyPromo')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Купить промокод' })
  async buyPromo(@User() user: UserEntity, @Body() body: BuyPromocodeDto) {
    const { productType } = body;
    return this.marketService.buyPromo(user, productType);
  }
}
