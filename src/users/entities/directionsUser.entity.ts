import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DirectionsEntity } from './directions.entity';

@Entity('directions_user_selected')
export class DirectionsSelectedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DirectionsEntity, (direction) => direction.direction_saved, {
    eager: true,
  })
  @JoinColumn()
  direction_info: DirectionsEntity;

  @ManyToOne(() => UserEntity, (user) => user.selected_directions, {
    cascade: true,
  })
  user: UserEntity;
}
