import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { MaterialTypesEnum, TaskStatusEnum } from '../enums';
import { UserEntity } from 'src/users/entities';
import { FileEntity } from 'src/storage/entities';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MaterialTypesEnum,
  })
  material_type: MaterialTypesEnum;

  @Column({ default: '' })
  moderated_link: string;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.FREE,
  })
  status: TaskStatusEnum;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.created_tasks, { eager: true })
  author: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.completed_tasks, { eager: true })
  completed_by: UserEntity;

  @ManyToMany(() => FileEntity, { eager: true })
  @JoinTable()
  files: FileEntity[];

  @Column({ default: 0 })
  completed_at: number;

  @Column()
  created_at: number;

  @Column({ default: 0 })
  views_count: number;
}
