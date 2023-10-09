import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AchievementEntity } from './achievement.entity';

@Entity('achievements_exists')
export class ExistAchievementEntity {
    @PrimaryColumn()
    id: number;

    @OneToMany(() => AchievementEntity, (achievement) => achievement.achievement_data)
    gived?: AchievementEntity[];

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image_name: string;

    @Column({ default: 0 })
    issued_manually: number;

    @Column()
    category: string;

}
