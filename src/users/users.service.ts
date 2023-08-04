import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { RoleEnum } from '@app/core/enums';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/prisma';
import { UserEntity } from '@prisma/client';
import { VKService } from '@app/vk';
import { UsersFieldsEnum } from '@app/vk/enums';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private vkService: VKService,
    private prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmins();
  }

  async seedAdmins() {
    const users = this.configService
      .get<string>('ADMIN_USERS')
      .split(',')
      .map(Number);

    await Promise.all(
      users.map(async (vk_id) => {
        await this.prisma.userEntity.upsert({
          where: {
            vk_id,
          },
          create: {
            vk_id,
            role: RoleEnum.ADMIN,
          },
          update: {},
        });
      }),
    );
  }

  async isAdmin(user: UserEntity) {
    return { isAdmin: user.role === RoleEnum.ADMIN };
  }

  async findOne(vk_id: number): Promise<UserEntity> {
    const user = await this.prisma.userEntity.findUnique({ where: { vk_id } });

    if (!user)
      throw new HttpException('Пользователь не найден.', HttpStatus.NO_CONTENT);

    return {
      ...user,
    };
  }

  async changeRole(vk_id: number, role: RoleEnum): Promise<UserEntity> {
    const user = await this.prisma.userEntity.findUnique({ where: { vk_id } });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.userEntity.update({
      where: { vk_id },
      data: { role },
    });
  }

  async getSelf(user: UserEntity): Promise<UserEntity> {
    return user;
  }

  async getTeam() {
    const staff = await this.prisma.userEntity.findMany({
      where: {
        role: {
          gte: RoleEnum.MODERATOR,
        },
      },
    });
    const sorted_staff = {};
    for (const i of staff) {
      if (i.department in sorted_staff) sorted_staff[i.department] = [];
      sorted_staff[i.department].push(i);
    }
    const ids = staff.map((user) => user.vk_id);
    const response = { items: sorted_staff };
    return this.vkService.concatUserObject(response, ids, [
      UsersFieldsEnum.PHOTO_200,
    ]);
  }
}
