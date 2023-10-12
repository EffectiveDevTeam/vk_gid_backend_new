import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketLogEntity, PromocodeEntity } from './entities';
import { UserEntity } from 'src/users/entities';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([MarketLogEntity, UserEntity, PromocodeEntity]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [TypeOrmModule, MarketService],
})
export class MarketModule {}
