import { UserEntity } from 'src/users/entities';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductsEnum } from '../enums/products.enum';

@Entity('promocodes')
export class PromocodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.added_promocodes)
  added_by: UserEntity;

  @Column({
    type: 'enum',
    enum: ProductsEnum,
  })
  type: ProductsEnum;

  @Column()
  promocode: string;

  @ManyToOne(() => UserEntity, (user) => user.activated_promocodes)
  activated_by: UserEntity;

  created_at: number;

  @Column({ default: 0 })
  activated_at: number;
}
