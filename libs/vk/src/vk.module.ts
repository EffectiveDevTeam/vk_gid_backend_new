import { Module } from '@nestjs/common';
import { VKService } from './vk.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [VKService],
  exports: [VKService],
})
export class VKModule {}
