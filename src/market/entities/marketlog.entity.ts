import { UserEntity } from 'src/users/entities';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MoneyOperationsEnum } from '../enums/moneyOperations.enum';
import { ProductsEnum } from '../enums/products.enum';

@Entity('market_logs')
export class MarketLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
  user: UserEntity;

  @Column()
  product: ProductsEnum;

  @Column()
  product_type: ProductsEnum;

  @Column({ type: 'enum', enum: MoneyOperationsEnum })
  operation: MoneyOperationsEnum;

  @Column()
  cost: number;

  @Column()
  operation_at: number;
}
