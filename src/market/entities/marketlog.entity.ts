import { UserEntity } from 'src/users/entities';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MoneyOperationsEnum } from '../enums/moneyOperations.enum';
import { ProductsEnum } from '../enums/products.enum';
import { ProductTypeEnum } from '../enums';

@Entity('market_logs')
export class MarketLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.market_operations, {
    cascade: true,
  })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ProductsEnum,
  })
  product: ProductsEnum;

  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
  })
  product_type: ProductTypeEnum;

  @Column({ type: 'enum', enum: MoneyOperationsEnum })
  operation: MoneyOperationsEnum;

  @Column()
  cost: number;

  @Column()
  operation_at: number;
}
