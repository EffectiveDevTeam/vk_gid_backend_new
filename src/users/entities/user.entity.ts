import { Entity, Column, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { RoleEnum } from '@app/core/enums';
import { DepartmentsEnum } from '../enums';
import { TaskEntity } from 'src/tasks/entities';
import { FileEntity } from 'src/storage/entities';
import { MarketLogEntity, PromocodeEntity } from 'src/market/entities';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ unique: true })
  vk_id: number;

  @Column({ default: 0 })
  registred: number;

  @Column({ default: 0 })
  last_seen: number;

  @Column({ default: 0 })
  balance: number;

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

  @OneToMany(() => FileEntity, (file) => file.uploaded_by)
  @JoinColumn()
  uploaded_files: FileEntity[];

  @OneToMany(() => MarketLogEntity, (logs) => logs.user)
  @JoinColumn()
  market_operations: MarketLogEntity[];

  @OneToMany(() => PromocodeEntity, (logs) => logs.added_by)
  @JoinColumn()
  added_promocodes: PromocodeEntity[];

  @OneToMany(() => PromocodeEntity, (logs) => logs.activated_by)
  @JoinColumn()
  activated_promocodes: PromocodeEntity[];
}
