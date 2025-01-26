import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ZodError } from 'zod';

import {
  ApiBadRequestException,
  ApiInternalServerException,
  ApiTimeoutException,
} from '@/utils/exceptions/http';

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (executionContext.getType() === 'http') {
          error.status = this.getStatusCode(error);

          const headers = executionContext.getArgs()[0]?.headers;

          if (typeof error === 'object' && !error.traceid) {
            error.traceid = headers.traceid;
          }

          if (!error?.context) {
            const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
            error.context = context;
          }
        }
        throw error;
      }),
    );
  }

  private getStatusCode(
    error:
      | ZodError
      | AxiosError<{ code: string | number; error: { code: string | number } }>,
  ): number {
    if (error instanceof ZodError) {
      return ApiBadRequestException.STATUS;
    }

    if (error?.code === 'ECONNABORTED' || error?.code === 'ECONNRESET') {
      return ApiTimeoutException.STATUS;
    }

    return [
      error.status,
      error?.response?.status,
      error?.response?.data?.code,
      error?.response?.data?.error?.code,
      ApiInternalServerException.STATUS,
    ].find(Boolean) as number;
  }
}
