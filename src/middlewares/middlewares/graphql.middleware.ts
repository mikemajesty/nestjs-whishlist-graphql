import { UserEntity } from '@/core/entity/user';
import { ITokenAdapter } from '@/libs/token';
import { ApiGraphqlUnathorizedException } from '@/utils/exceptions/graphql';
import { UserRequest } from '@/utils/types';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphqlAuthenticationInterceptor implements NestInterceptor {

  constructor(private readonly tokenService: ITokenAdapter) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const gqlContext = GqlExecutionContext.create(context);
    const req: Request & { token?: string, user?: UserRequest } = gqlContext.getContext().req;

    if (!req?.token) {
      throw new ApiGraphqlUnathorizedException('token must be provided')
    }

    const token = req?.token.split(' ')[1];
    const userDecoded = await this.tokenService.verify<UserRequest>(token)

    req.user = new UserEntity(userDecoded);

    return next.handle()
  }
}