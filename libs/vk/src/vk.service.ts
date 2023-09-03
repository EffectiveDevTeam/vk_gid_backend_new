import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersFieldsEnum, VKMethodsEnum } from './enums';
import { ConfigService } from '@nestjs/config';

export type ConcatUsersType<T> = {
  response: T;
  users_info: object[];
};

@Injectable()
export class VKService {
  constructor(private configService: ConfigService) {}

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
  async usersGet(user_ids: number[], fields: string): Promise<object[]> {
    const data = {
      fields,
      user_ids: user_ids.join(','),
    };
    const usersInfo = await this.request(VKMethodsEnum.USERS_GET, data);
    return usersInfo.response;
  }
  async concatUserObject<T = object>(
    response: T,
    user_ids: number[],
    fields?: UsersFieldsEnum[],
  ): Promise<ConcatUsersType<T>> {
    return {
      response,
      users_info: await this.usersGet(user_ids, this.concatFields(fields)),
    };
  }

  concatFields(fields: UsersFieldsEnum[]): string {
    return fields.join(',');
  }
}
