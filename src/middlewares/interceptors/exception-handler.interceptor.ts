import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';

import { ApiBadRequestException, ApiInternalServerException, ApiTimeoutException } from '@/utils/exception';

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        error.status = this.getStatusCode(error);

        const headers = executionContext.getArgs()[0]?.headers;

        const request = executionContext.switchToHttp().getRequest();

        this.sanitizeExternalError(error);

        if (typeof error === 'object' && !error.traceid) {
          error.traceid = headers.traceid;
        }

        if (!error?.context) {
          const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
          error.context = context;
        }

        throw error;
      })
    );
  }

  private getStatusCode(
    error: ZodError | AxiosError<{ code: string | number; error: { code: string | number } }>
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
      ApiInternalServerException.STATUS
    ].find(Boolean) as number;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitizeExternalError(error: any) {
    if (typeof error?.response === 'object' && error?.isAxiosError) {
      const status = [error?.response?.data?.code, error?.response?.data?.error?.code, error?.status].find(Boolean);
      error.message = [error?.response?.data?.message, error?.response?.data?.error?.message, error.message].find(
        Boolean
      );
      error['getResponse'] = () => [error?.response?.data?.error, error?.response?.data].find(Boolean);
      error['getStatus'] = () => status;
    }
  }
}
