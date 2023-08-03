import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/prisma';
import { AuthModule, RolesGuard } from '@app/auth';
import { AdminsModule } from './admins/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    PrismaModule,
    AuthModule,
    AdminsModule,
    RequestsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
