import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageController } from 'src/storage/storage.controller';
import { StorageService } from 'src/storage/storage.service';
import { FileEntity } from './entities';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService, ConfigModule],
})
export class StorageModule {}
