import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminEntity } from '@prisma/client';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): AdminEntity => {
    const request = ctx.switchToHttp().getRequest();
    const user: AdminEntity = request.user;

    return data ? user?.[data] : user;
  },
);
