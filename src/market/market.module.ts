import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from 'src/storage/storage.module';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketLogEntity, PurchasedColorEntity, PurchasedIconEntity } from './entities';
import { UserEntity } from 'src/users/entities';


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      MarketLogEntity, 
      UserEntity,
      PurchasedIconEntity,
      PurchasedColorEntity,
    ]),
    StorageModule,
  ],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [TypeOrmModule],
})
export class MarketModule {}
