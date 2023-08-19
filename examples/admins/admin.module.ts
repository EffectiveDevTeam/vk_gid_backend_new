import { Module } from '@nestjs/common';
import { AdminsService } from './admin.service';
import { AdminsController } from './admin.controller';
import { PrismaModule } from '@app/prisma';
import { ExcelModule } from '@app/excel';
import { JwtStrategy } from '@app/auth';
import { ConfigModule } from '@nestjs/config';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
  imports: [ConfigModule, PrismaModule, ExcelModule, RequestsModule],
  providers: [AdminsService, JwtStrategy],
  controllers: [AdminsController],
  exports: [AdminsService],
})
export class AdminsModule {}
