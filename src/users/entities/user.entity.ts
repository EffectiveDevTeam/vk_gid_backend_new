import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { RoleEnum } from '@app/core/enums';
import { DepartmentsEnum } from '../enums';
import { TaskEntity } from 'src/tasks/entities';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vk_id: number;

  @Column()
  registred: number;

  @Column()
  last_seen: number;

  @OneToMany(() => TaskEntity, (task) => task.author)
  created_tasks: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.completed_by)
  completed_tasks: TaskEntity[];

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role: RoleEnum;

  @Column({
    type: 'enum',
    enum: DepartmentsEnum,
    default: DepartmentsEnum.REDACTION,
  })
  department: DepartmentsEnum;

  @OneToMany(() => FileEntity, (file) => file.owner)
  @JoinColumn()
  files: FileEntity[];
}
