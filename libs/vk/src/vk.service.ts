import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersFieldsEnum, VKMethodsEnum } from './enums';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

export type ConcatUsersType<T> = {
  response: T;
  users_info: object[];
};

const REDIS_VK_NAMESPACE = 'VK_INFO';

@Injectable()
export class VKService {
  constructor(
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  readonly API_VK_URL = this.configService.get('API_VK_URL');
  readonly VK_USER_TOKEN = this.configService.get('VK_USER_TOKEN');
  readonly VK_COMMUNITY_TOKEN = this.configService.get('VK_COMMUNITY_TOKEN');
  readonly VK_MINIAPP_TOKEN = this.configService.get('VK_MINIAPP_TOKEN');
  readonly API_VK_VERSION = this.configService.get('API_VK_VERSION');

  async request(
    method: VKMethodsEnum,
    json: object,
    token = this.VK_MINIAPP_TOKEN,
  ) {
    const formData = new FormData();
    for (const key in json) {
      formData.append(key, json[key]);
    }
    formData.append('v', this.API_VK_VERSION);
    formData.append('lang', '0');
    formData.append('access_token', token);

    const result = await (
      await fetch(this.API_VK_URL + '/method/' + method, {
        method: 'POST',
        body: formData,
      })
    ).json();
    if ('error' in result) throw new BadRequestException(result);
    return result;
  }
  async usersGet(userIds: number[], fields: string): Promise<object[]> {
    const userInfo = [];
    let infoFromRedis = true;
    for (const user_id of userIds) {
      const redisData = JSON.parse(
        await this.redis.get(REDIS_VK_NAMESPACE + user_id),
      );
      if (!redisData) {
        infoFromRedis = false;
        break;
      }
      userInfo.push(redisData);
    }
    if (infoFromRedis) {
      return userInfo;
    }
    const data = {
      fields,
      user_ids: userIds.join(','),
    };
    const usersInfo = await this.request(VKMethodsEnum.USERS_GET, data);

    for (const userData of usersInfo.response) {
      await this.redis.set(
        REDIS_VK_NAMESPACE + userData.id,
        JSON.stringify(userData),
        'EX',
        3600,
      );
    }
    return usersInfo.response;
  }
  async resolveUserLink(link: string): Promise<{ object_id: number }> {
    const data = {
      screen_name: link,
    };
    const userLink = await this.request(
      VKMethodsEnum.RESOLVE_SCREEN_NAME,
      data,
    );
    return userLink.response;
  }
  async concatUserObject<T = object>(
    response: T,
    user_ids: number[],
    fields?: UsersFieldsEnum[],
  ): Promise<ConcatUsersType<T>> {
    return {
      response,
      users_info: await this.usersGet(
        user_ids,
        this.concatFields(fields ? fields : [UsersFieldsEnum.PHOTO_200]),
      ),
    };
  }

  concatFields(fields: UsersFieldsEnum[]): string {
    return fields.join(',');
  }
}
