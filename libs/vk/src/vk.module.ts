import { Module } from '@nestjs/common';
import { VKService } from './vk.service';

@Module({
  providers: [VKService],
  exports: [VKService],
})
export class VKModule {}
