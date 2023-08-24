import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { ConfigService } from '@nestjs/config';
import { StorageService } from 'src/storage/storage.service';
import { getTime } from '@app/utils';
import { ProductsEnum } from './enums/products.enum';
import { MoneyOperationsEnum } from './enums/moneyOperations.enum';
import { MarketLogEntity } from './entities';

@Injectable()
export class MarketService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(MarketLogEntity)
    private readonly marketLogRepository: Repository<MarketLogEntity>,
  ) {}

  async marketLogger(
    user: UserEntity,
    product: ProductsEnum,
    operation: MoneyOperationsEnum,
    cost: number,
  ): Promise<MarketLogEntity> {
    return await this.marketLogRepository.save({
      user,
      product,
      operation,
      cost,
      operation_at: getTime(),
    });
  }

  async manageUserMoney(
    user: UserEntity,
    productType: ProductsEnum,
    operation: MoneyOperationsEnum,
    cost: number,
  ): Promise<number> {
    let money = user.balance;
    switch (operation) {
      case MoneyOperationsEnum.ADDITION:
        money += cost;
        break;
      case MoneyOperationsEnum.SUBSTRACTION:
        if (user.role < RoleEnum.MODERATOR) {
          if (money < cost)
            throw new PreconditionFailedException('Недостаточно средств');
          money -= cost;
        }
        break;
    }
    await this.marketLogger(user, productType, operation, cost);
    await this.usersRepository.update(
      { vk_id: user.vk_id },
      { balance: money },
    );
    return money;
  }
}
