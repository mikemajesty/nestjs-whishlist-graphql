import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ILoggerAdapter } from '@/infra/logger';
import { UUIDUtils } from '@/utils/uuid';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: ILoggerAdapter) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    if (executionContext.getType() === 'http') {
      const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;

      const request = executionContext.switchToHttp().getRequest();

      request['context'] = context;

      if (!request.headers?.traceid) {
        request.headers.traceid = UUIDUtils.create();
        request.id = request.headers.traceid;
      }
      this.logger.setGlobalParameters({ traceid: request.id });
    }

    if (executionContext.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(executionContext);
      const res: Response = gqlContext.getContext().res;
      const requestId = UUIDUtils.create();

      res.set('traceId', requestId);
      this.logger.setGlobalParameters({ traceid: requestId });
    }
    return next.handle();
  }
}
