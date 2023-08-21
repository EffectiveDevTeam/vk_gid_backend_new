import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { RoleEnum } from '@app/core/enums';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vk_id: number;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role: RoleEnum;

  @OneToMany(() => FileEntity, (file) => file.owner)
  @JoinColumn()
  files: FileEntity[];
}
