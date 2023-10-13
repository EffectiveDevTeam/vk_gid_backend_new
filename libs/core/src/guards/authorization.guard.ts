import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { parse, stringify } from 'querystring';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@app/core/decorators';
import { getTime } from '@app/utils';
import { UserEntity } from 'src/users/entities';

const TOKEN_LIFETIME = 12 * 60 * 60 * 1000;

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private secret = this.configService.get<string>('VK_SECRET');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler())) {
      return true;
    }

    const authorization = request.headers['authorization'] as string;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Не указан токен в Authorization');
    }

    const [type, token] = authorization.split(' ');
    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException('Токен невалиден, не хватает Bearer');
    }

    const data = parse(token);
    const vk_id = Number.parseInt(data.vk_user_id as string);
    const sign = data.sign as string;

    const signParams = {};

    for (const key of Object.keys(data).sort())
      if (key.slice(0, 3) === 'vk_') signParams[key] = data[key];

    const stringParams = stringify(signParams);

    const signHash = createHmac('sha256', this.secret)
      .update(stringParams)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    if (sign !== signHash) {
      throw new UnauthorizedException('Не совпадает подпись');
    }

    if (
      Date.now() - Number.parseInt(data['vk_ts'] as string) * 1000 >
      TOKEN_LIFETIME
    ) {
      throw new UnauthorizedException('Токен просрочен');
    }

    let user = await this.usersRepository.findOneBy({ vk_id });
    const currentTime = getTime();
    if (!user) {
      await this.usersRepository
        .createQueryBuilder('users')
        .insert()
        .into(UserEntity)
        .values({ vk_id, registred: currentTime, last_seen: currentTime })
        .orIgnore()
        .execute();
    } else {
      await this.usersRepository.save({ vk_id, last_seen: currentTime });
    }

    user = await this.usersRepository.findOne({
      where: { vk_id },
      relations: {
        selected_directions: {
          direction_info: true,
        },
      },
    });

    request.user = user;

    return true;
  }
}
