import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strateges';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/prisma';
import { AuthController } from './auth.controller';
import { AdminsService } from 'src/admins/admin.service';
import { ExcelModule } from '@app/excel';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    ExcelModule,
    PassportModule,
    RequestsModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminsService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
