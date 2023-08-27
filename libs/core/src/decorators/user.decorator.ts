import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/entities';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return data ? user?.[data] : user;
  },
);
