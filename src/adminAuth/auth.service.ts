import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminsService } from '../admins/admin.service';
import { JwtService } from '@nestjs/jwt';
import { JWTTokenData } from './strateges';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/prisma';
import * as crypto from 'crypto';
import { RoleEnum } from '@app/core/enums';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private adminsService: AdminsService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminAccount();
  }
  async seedAdminAccount() {
    const adm_login = this.configService.get<string>('ADMIN_LOGIN');
    const adm_pass = this.configService.get<string>('ADMIN_PASSWORD');
    await this.signUp(adm_login, adm_pass, RoleEnum.ADMIN);
  }

  async getPasswordHash(password: string, salt: Buffer) {
    return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');
  }

  async signUp(username: string, password: string, role: RoleEnum) {
    const adm_account = await this.adminsService.findOne(username);
    if (adm_account) return;
    const salt = crypto.randomBytes(16);
    const hash = await this.getPasswordHash(password, salt);

    await this.prisma.adminEntity.create({
      data: {
        username,
        pass_hash: hash.toString('base64'),
        pass_salt: salt.toString('base64'),
        role,
      },
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.adminsService.findOne(username);
    if (!user) return null;

    const salt = Buffer.from(user.pass_salt, 'base64');
    const hash = await this.getPasswordHash(password, salt);

    if (!crypto.timingSafeEqual(Buffer.from(user.pass_hash, 'base64'), hash)) {
      return null;
    }
    const { pass_hash, pass_salt, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload: JWTTokenData = {
      username: user.username,
      uid: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
