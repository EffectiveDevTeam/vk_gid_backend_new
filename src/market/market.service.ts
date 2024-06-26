import {
  ConflictException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpMessagesEnum, RoleEnum } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { ConfigService } from '@nestjs/config';
import { getTime } from '@app/utils';
import { ProductsEnum } from './enums/products.enum';
import { MoneyOperationsEnum } from './enums/moneyOperations.enum';
import { MarketLogEntity, PromocodeEntity } from './entities';
import { HistoryTypeEnum, ProductTypeEnum } from './enums';
import { MaterialTypesEnum } from 'src/tasks/enums';

@Injectable()
export class MarketService {
  readonly MARKET_PREFIX = this.configService.get('MARKET_PREFIX');
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(MarketLogEntity)
    private readonly marketLogRepository: Repository<MarketLogEntity>,
    @InjectRepository(PromocodeEntity)
    private readonly promocodeRepository: Repository<PromocodeEntity>,
  ) {}

  async getPrices() {
    const prices = {};

    for (const i of Object.keys(ProductsEnum)) {
      const price = this.configService.get(this.MARKET_PREFIX + i);
      if (price) {
        prices[i] = +price;
      } else {
        prices[i] = -1;
      }
    }
    return prices;
  }

  async getInStockProducts() {
    const promoInStock = await this.promocodeRepository
      .createQueryBuilder('promocodes')
      .select('promocodes.type', 'type')
      .where('promocodes.activated_at = :activated', { activated: 0 })
      .distinct(true)
      .getRawMany<{ type: string }>();

    return promoInStock.map((promo) => promo.type);
  }

  async marketLogger(
    user: UserEntity,
    product: ProductsEnum,
    operation: MoneyOperationsEnum,
    cost: number,
    product_type = MaterialTypesEnum.CLIP,
  ): Promise<MarketLogEntity> {
    return await this.marketLogRepository.save({
      user,
      product,
      operation,
      product_type,
      cost,
      operation_at: getTime(),
    });
  }

  async manageUserMoney(
    user: UserEntity,
    productType: ProductsEnum,
    operation: MoneyOperationsEnum,
    cost: number,
    materialType = MaterialTypesEnum.CLIP,
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
    await this.marketLogger(user, productType, operation, cost, materialType);
    await this.usersRepository.update(
      { vk_id: user.vk_id },
      { balance: money },
    );
    return money;
  }

  async addPromo(
    user: UserEntity,
    promocode: string,
    productType: ProductsEnum,
  ) {
    const exist_promo = await this.promocodeRepository.findOneBy({ promocode });
    if (exist_promo)
      throw new ConflictException(HttpMessagesEnum.MARKET_EXISTS);

    const data = {
      added_by: user,
      type: productType,
      promocode,
      created_at: getTime(),
    };

    return this.promocodeRepository.save(data);
  }

  async buyPromo(giveTo: UserEntity, productType: ProductsEnum) {
    const product = await this.promocodeRepository.findOneBy({
      type: productType,
      activated_at: 0,
    });
    if (!product)
      throw new NotFoundException(HttpMessagesEnum.MARKET_PROMO_NOT_FOUND);

    const cost = this.configService.get(this.MARKET_PREFIX + productType);

    product.activated_at = getTime();
    product.activated_by = giveTo;
    const promo = await this.promocodeRepository.save(product);
    await this.marketLogger(
      giveTo,
      productType,
      MoneyOperationsEnum.SUBSTRACTION,
      cost,
    );
    return promo;
  }

  async getHistory(user: UserEntity) {
    const historyAddition = await this.mapHistoryAdditions(
      await this.marketLogRepository.find({
        where: {
          user,
          operation: MoneyOperationsEnum.ADDITION,
        },
        order: {
          operation_at: 'DESC',
        },
      }),
    );
    const promocodes = await this.mapPromocodes(
      await this.promocodeRepository.find({
        where: {
          activated_by: { vk_id: user.vk_id },
        },
        order: { activated_at: 'DESC' },
      }),
    );
    const history = [...promocodes, ...historyAddition].sort(
      (a, b) => b.time - a.time,
    );

    return history;
  }
  async mapPromocodes(promocodes: PromocodeEntity[]) {
    const prices = await this.getPrices();
    const promocodes_mapped = promocodes.map((promocode) => ({
      ...promocode,
      typeHistory: HistoryTypeEnum.PROMOCODE,
      cost: prices[promocode.type],
      time: promocode.activated_at,
    }));
    return promocodes_mapped;
  }

  async mapHistoryAdditions(history: MarketLogEntity[]) {
    const history_mapped = history.map((history) => ({
      ...history,
      typeHistory: HistoryTypeEnum.ADDITION_BALANCE,
      cost: history.cost,
      time: history.operation_at,
    }));
    return history_mapped;
  }
}
