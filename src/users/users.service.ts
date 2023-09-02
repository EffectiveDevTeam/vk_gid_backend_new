import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { RoleEnum } from '@app/core/enums';
import { ConfigService } from '@nestjs/config';
import { VKService } from '@app/vk';
import { UsersFieldsEnum } from '@app/vk/enums';
import { UserEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private vkService: VKService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
        await this.usersRepository.save({
          vk_id,
          role: RoleEnum.ADMIN,
        });
      }),
    );
  }

  async isAdmin(user: UserEntity) {
    return { isAdmin: user.role === RoleEnum.ADMIN };
  }

  async findOne(vk_id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ vk_id });

    if (!user)
      throw new HttpException('Пользователь не найден.', HttpStatus.NO_CONTENT);

    return {
      ...user,
    };
  }

  async changeRole(vk_id: number, role: RoleEnum): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ vk_id });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.role = role;
    return await this.usersRepository.save(user);
  }

  async getSelf(user: UserEntity): Promise<UserEntity> {
    return user;
  }

  async getTeam() {
    const staff = await this.usersRepository.find({
      where: { role: MoreThanOrEqual(RoleEnum.MODERATOR) },
    });
    console.log(staff);
    const sorted_staff = {};
    for (const i of staff) {
      if (i.department in sorted_staff) sorted_staff[i.department] = [];
      sorted_staff[i.department].push(i);
    }
    const ids = staff.map((user) => user.vk_id);
    return this.vkService.concatUserObject<object>(sorted_staff, ids, [
      UsersFieldsEnum.PHOTO_200,
    ]);
  }

  async addNewMember() {
    console.log();
  }
}
