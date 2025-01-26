import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ILoggerAdapter } from '@/infra/logger';
import { ITokenAdapter } from '@/libs/token';
import { UserRequest } from '@/utils/types';
import { UUIDUtils } from '@/utils/uuid';

import { ApiUnauthorizedException } from '../../utils/exceptions/http';

@Injectable()
export class HttpAuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: ITokenAdapter,
    private readonly loggerService: ILoggerAdapter,
  ) {}
  async use(
    request: Request & { user: UserRequest; id: string },
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const tokenHeader = request.headers.authorization;

    if (!request.headers?.traceid) {
      Object.assign(request.headers, { traceid: request['id'] ?? UUIDUtils.create() });
    }

    if (!tokenHeader) {
      response.status(ApiUnauthorizedException.STATUS);
      request.id = request.headers.traceid as string;
      this.loggerService.logger(request, response);
      throw new ApiUnauthorizedException('no token provided');
    }

    const token = tokenHeader.split(' ')[1];

    request.id = request.headers.traceid as string;


    const userDecoded = (await this.tokenService.verify<UserRequest>(token).catch((error: { status: number }) => {
      error.status = ApiUnauthorizedException.STATUS;
      this.loggerService.logger(request, response);
      next(error);
    })) as UserRequest;

    request.user = userDecoded;

    next();
  }
}
