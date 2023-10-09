import { ACHIEVEMENT_REDACTOR_5_YEARS } from '../../constants';
import { UserEntity } from '../../../users/entities';
import { DataSource, LessThan, Not, Repository } from 'typeorm';
import { AchievementHandler } from './achievements';
import { getPersent, getTime } from '@app/utils';
import { TimesEnum } from '@app/core/enums';

export class Redactor5Years extends AchievementHandler {
    usersRepository: Repository<UserEntity>
    YEARS: number = 5 * TimesEnum.YEAR;

    constructor(
        protected readonly dataSource: DataSource,
    )
    {
        super(dataSource, ACHIEVEMENT_REDACTOR_5_YEARS)
        this.usersRepository = this.dataSource.getRepository(UserEntity);
    }

    async condition() {
        let currentTime = getTime();
        let haveAchievements = await this.usersRepository.find({
            select: {
                isBeRedactor: true,
                vk_id: true,
            },
            where: { 
                isBeRedactor: Not(0),
                achievements: {
                    persent_completed: LessThan(100),
                    achievement_data: {
                        id: ACHIEVEMENT_REDACTOR_5_YEARS.id
                    }
            }}
        })

        let dontHaveAchievements = await this.usersRepository.find({
            select: {
                isBeRedactor: true,
                vk_id: true,
            },
            where: { 
                isBeRedactor: Not(0),
                achievements: {
                    achievement_data: {
                        id: Not(ACHIEVEMENT_REDACTOR_5_YEARS.id)
                    }
                }
            }
        })
        let resp = haveAchievements.map(v => ({...v, have: true})).concat(dontHaveAchievements.map(v => ({...v, have: false})))
        return resp.map(user => {
            return ({
            uid: user.vk_id, 
            persent: getPersent(this.YEARS, currentTime - user.isBeRedactor),
            isFirst: !user.have || getPersent(this.YEARS, currentTime - user.isBeRedactor) === 100
        })});
    }
}