import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { HttpMessagesEnum, RoleEnum } from '@app/core/enums';
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
import { AddNewMemberDto } from './dto';
import { getTime } from '@app/utils';
import { TaskEntity } from 'src/tasks/entities';
import { TaskStatusEnum } from 'src/tasks/enums';

type AdditionUserInfo = {
  stat: {
    publicationsCount: number;
    viewsCount: number;
  };
};

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
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
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
    const existUsersIds = (
      await this.usersRepository.findBy({ vk_id: In(users) })
    ).map((v) => v.vk_id);
    await Promise.all(
      users
        .filter((v) => !existUsersIds.includes(v))
        .map(async (vk_id) => {
          await this.usersRepository.save({
            vk_id,
            role: RoleEnum.ADMIN,
            registred: getTime(),
            last_seen: getTime(),
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

  async getSelf(
    user: UserEntity,
  ): Promise<ConcatUsersType<UserEntity & AdditionUserInfo>> {
    const counters = await this.tasksRepository
      .createQueryBuilder('tasks')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(tasks.views_count)', 'totalViews')
      .where('tasks.status = :status', { status: TaskStatusEnum.COMPLETED })
      .getRawOne<{ count: string; totalViews: string }>();
    const stat = {
      publicationsCount: +counters.count,
      viewsCount: +counters.totalViews,
    };
    const fullUserInfo = { ...user, stat };
    return this.vkService.concatUserObject<UserEntity & AdditionUserInfo>(
      fullUserInfo,
      [user.vk_id],
      [UsersFieldsEnum.PHOTO_200],
    );
  }

  async getTeam() {
    const staff = await this.usersRepository.find({
      where: { role: MoreThanOrEqual(RoleEnum.USER) },
      relations: { selected_directions: true },
    });
    const ids = staff.map((user) => user.vk_id);
    return this.vkService.concatUserObject<object>(staff, ids, [
      UsersFieldsEnum.PHOTO_200,
    ]);
  }

  async addNewMember(data: AddNewMemberDto) {
    const price = +this.configService.get('MARKET_PRICES_VOICES_20');
    const userScreenName = await this.vkService.resolveUserLink(data.link);
    if (!userScreenName?.object_id)
      throw new NotFoundException(HttpMessagesEnum.USERS_NOT_FOUND);
    return this.usersRepository.save({
      vk_id: userScreenName.object_id,
      registred: getTime(),
      last_seen: getTime(),
      department: data.department,
      balance: data.isPromo ? price : 0,
      role: data.isModer ? RoleEnum.MODERATOR : RoleEnum.USER,
    });
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
