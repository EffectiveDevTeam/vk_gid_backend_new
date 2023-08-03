import { RoleEnum } from '@app/core';

export * from './jwt.strategy';
export * from './local.strategy';

export type JWTTokenData = {
  username: string;
  uid: number;
  role: RoleEnum;
};
