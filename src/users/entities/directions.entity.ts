import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DirectionsSelectedEntity } from './directionsUser.entity';

@Entity('directions')
export class DirectionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @OneToMany(
    () => DirectionsSelectedEntity,
    (direction_saved) => direction_saved.direction_info,
  )
  direction_saved: DirectionsSelectedEntity;
}
