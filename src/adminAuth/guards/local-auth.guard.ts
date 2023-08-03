import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
  handleRequest(
    err: any,
    user: any,
    context: ExecutionContext | { message: string },
    status: any,
  ) {
    if (err || !user) {
      if (!context) throw err || new UnauthorizedException();
      if ('message' in context)
        throw err || new UnauthorizedException(context.message);
    }
    return user;
  }
}
