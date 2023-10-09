import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
  } from 'typeorm';
  import { UserEntity } from '../../users/entities';
import { ExistAchievementEntity } from '.';
  
  @Entity('achievements')
  export class AchievementEntity {
    @PrimaryColumn()
    multy_id: string;
    
    @ManyToOne(() => UserEntity, (user) => user.vk_id, { cascade: true })
    user: UserEntity;

    @ManyToOne(() => ExistAchievementEntity, (achievement) => achievement.gived, { cascade: true })
    achievement_data: ExistAchievementEntity;
  
    @Column({ default: 0 })
    give_by: number;
  
    @Column({ default: 0 })
    date: number;

    @Column({ default: 0 })
    persent_completed: number;
  }
  