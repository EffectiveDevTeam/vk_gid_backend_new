import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../users/entities';
import { ACHIEVEMENTS } from './constants';
import { giveAchievementDto } from './dto';
import { AchievementEntity } from './entities';
import { ExistAchievementEntity } from './entities/existAchievement.entity';
import { AchievementHandler } from './sheduled/achievements/achievements';
import { VKService } from '@app/vk';
import { UsersFieldsEnum } from '@app/vk/enums';

@Injectable()
export class AchievementsService implements OnApplicationBootstrap {
  constructor(
    private dataSource: DataSource,
    private readonly vkService: VKService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
    @InjectRepository(ExistAchievementEntity)
    private readonly existAchievementRepository: Repository<ExistAchievementEntity>,
  ) {}
  async onApplicationBootstrap() {
    await this.seedAchievements();
  }

  async seedAchievements() {
    this.existAchievementRepository.save(
      ACHIEVEMENTS.map((v) =>
        this.existAchievementRepository.create({
          ...v,
          issued_manually: +v?.issued_manually,
        }),
      ),
    );
  }

  async giveAchievement(dto: giveAchievementDto) {
    const { vk_id, achievement_id } = dto;
    const achievement = await this.existAchievementRepository.findOneBy({
      id: achievement_id,
    });
    if (!achievement) throw new NotFoundException('Achievement id not found');

    const user = await this.usersRepository.findOneBy({ vk_id });
    if (!user) throw new NotFoundException('User id not found');
    const handler = new AchievementHandler(this.dataSource, achievement);
    const userData = {
      uid: vk_id,
      persent: 100,
      isFirst: true,
    };
    return await handler.giveManually([userData]);
  }
  async getAchievement(user: UserEntity) {
    await this.achievementRepository.find({
      where: { user },
      relations: {
        achievement_data: true,
      },
    });
  }

  async getById(user: UserEntity, id: number) {
    const achievement = await this.existAchievementRepository.findOneBy({ id });
    if (!achievement) throw new NotFoundException('Достижение не найдено');
    const count = await this.achievementRepository
      .createQueryBuilder('ach')
      .select('COUNT(*)', 'count')
      .where('ach.achievement_data = :id', { id })
      .andWhere('ach.persent_completed = :persent', { persent: 100 })
      .getRawOne();

    const items = await this.achievementRepository.find({
      relations: {
        user: true,
      },
      where: {
        achievement_data: achievement,
        persent_completed: 100,
      },
      take: 3,
    });
    const uids = items.map((achiev) => achiev.user.vk_id);
    return {
      achievement,
      users: {
        count: +count.count,
        items: await this.vkService.usersGet(uids, [UsersFieldsEnum.PHOTO_200]),
      },
    };
  }

  async easterEggPublicOpen(user: UserEntity, achievement_id: number) {
    return await this.giveAchievement({ vk_id: user.vk_id, achievement_id });
  }
}
