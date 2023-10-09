import { AchievementEntity, ExistAchievementEntity } from '../../entities';
import { DataSource } from 'typeorm';
import { getTime } from '@app/utils';
import { UserEntity } from 'src/users/entities';

type UsersGiveAchievements = {uid: number, persent: number, isFirst: boolean}

export class AchievementHandler {

    constructor(
        protected readonly dataSource: DataSource,
        public achievement: ExistAchievementEntity
    )
    {}

    async give(users_ids: UsersGiveAchievements[]) {
        if (!users_ids.length) return;
        let currentTime = getTime();
        let savedUsers = [];
        for(let user of users_ids) {
            let data = {
                user: this.dataSource.manager.create(UserEntity, { vk_id: user.uid }),
                achievement_data: {...this.achievement, issued_manually: +this.achievement.issued_manually},
                persent_completed: user.persent,
                multy_id: `${user.uid}_${this.achievement.id}`
            }
            
            if (user.isFirst) {
                savedUsers.push({...data, date: currentTime})
            } else {
                savedUsers.push(data)
            }
        }
        return await this.dataSource.manager.save(AchievementEntity, savedUsers)
        
    }
    async condition(): Promise<UsersGiveAchievements[]> {
        return []
    }

    async giveAuto() {
        let users_ids = await this.condition();
        await this.give(users_ids);
    }
    async giveManually(users_ids: UsersGiveAchievements[]) {
        return await this.give(users_ids);
    }
}