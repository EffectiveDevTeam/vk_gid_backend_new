import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { RoleEnum } from '@app/core/enums';
import { ConfigService } from '@nestjs/config';
import { ConcatUsersType, VKService } from '@app/vk';
import { UsersFieldsEnum } from '@app/vk/enums';
import {
  DirectionsEntity,
  DirectionsSelectedEntity,
  UserEntity,
} from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { DirectionsEnum } from './enums/directions.enum';
import { convertEnumToArray } from '@app/utils';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private vkService: VKService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(DirectionsEntity)
    private readonly directionsRepository: Repository<DirectionsEntity>,
    @InjectRepository(DirectionsSelectedEntity)
    private readonly directionSelectedRepository: Repository<DirectionsSelectedEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmins();
    await this.seedDirections();
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

  async seedDirections() {
    const directions = Object.keys(DirectionsEnum);
    const existDirections = (await this.directionsRepository.find()).map(
      (v) => v.key,
    );
    await Promise.all(
      directions
        .filter((v) => !existDirections.includes(v))
        .map(async (direction) => {
          await this.directionsRepository.save({
            key: direction,
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

  async getSelf(user: UserEntity): Promise<ConcatUsersType<UserEntity>> {
    return this.vkService.concatUserObject<UserEntity>(
      user,
      [user.vk_id],
      [UsersFieldsEnum.PHOTO_200],
    );
  }

  async getTeam() {
    const staff = await this.usersRepository.find({
      where: { role: MoreThanOrEqual(RoleEnum.MODERATOR) },
    });
    const sorted_staff = {};
    for (const i of staff) {
      if (!(i.department in sorted_staff)) sorted_staff[i.department] = [];
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

  async saveDirectionsUser(user: UserEntity, directions: string[]) {
    const directionsExists = await this.directionsRepository.find({
      where: { key: In(directions) },
    });
    if (!directionsExists) throw new NotFoundException();

    const savedDirections = await this.directionSelectedRepository.findBy({
      user,
    });
    await this.directionSelectedRepository.remove(savedDirections);
    const newEntities = [];
    for (const i of directionsExists) {
      newEntities.push({ user, direction_info: i });
    }
    await this.directionSelectedRepository.save(newEntities);

    return this.directionSelectedRepository.find({
      relations: { direction_info: true },
      where: { user },
    });
  }
}
