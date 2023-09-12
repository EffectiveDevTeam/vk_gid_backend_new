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

  @OneToOne(() => DirectionsEntity)
  @JoinColumn()
  direction_info: DirectionsEntity;

  @ManyToOne(() => UserEntity, (user) => user.selected_directions, {
    cascade: true,
  })
  user: UserEntity;
}
