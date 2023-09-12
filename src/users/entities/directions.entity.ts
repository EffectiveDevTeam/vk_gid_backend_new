import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { DirectionsSelectedEntity } from './directionsUser.entity';

@Entity('directions')
export class DirectionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @OneToOne(
    () => DirectionsSelectedEntity,
    (direction_saved) => direction_saved.direction_info,
  )
  direction_saved: DirectionsSelectedEntity;
}
