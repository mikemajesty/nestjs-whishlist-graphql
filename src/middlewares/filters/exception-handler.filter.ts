import {
  ExceptionFilter as AppExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
} from '@nestjs/common';
import { ZodError, ZodIssue, ZodUnrecognizedKeysIssue } from 'zod';

import { ILoggerAdapter } from '@/infra/logger/adapter';
import { DateUtils } from '@/utils/date';
import {
  ApiBadRequestException,
  ApiErrorType,
  ApiInternalServerException,
  HttpBaseException,
} from '@/utils/exceptions/http';
import { DefaultErrorMessage } from '@/utils/http-status';

@Catch()
export class ExceptionHandlerFilter implements AppExceptionFilter {
  constructor(private readonly loggerService: ILoggerAdapter) {}

  catch(exception: HttpBaseException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    if (host.getType() === 'http') {
      const response = context.getResponse();
      const request = context.getRequest<Request>();

      const status = this.getStatus(exception);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exception.traceid = [exception.traceid, (request as any)['id']].find(
        Boolean,
      );

      this.loggerService.error(exception, exception.message);
      const message = this.getMessage(exception, status as number);

      return response.status(status).json({
        error: {
          code: status,
          traceid: exception.traceid,
          context: exception.context ?? exception?.parameters?.context,
          message,
          timestamp: DateUtils.getDateStringWithFormat(),
          path: request.url,
        },
      } as ApiErrorType);
    }
  }

  private getMessage(
    exception: HttpBaseException,
    status: string | number,
  ): string[] {
    const defaultError = DefaultErrorMessage[String(status)];
    if (defaultError) {
      return [defaultError];
    }

    if (exception instanceof ZodError) {
      return exception.issues.map((issue: ZodIssue) => {
        const path =
          (issue as ZodUnrecognizedKeysIssue)?.keys?.join('.') ||
          issue?.path?.join('.') ||
          'key';

        const idArrayError = new RegExp(/^\d./).exec(path);
        if (idArrayError?.length) {
          return `${path.replace(/^\d./, `array position: ${Number(new RegExp(/^\d/)?.exec(path)?.[0])}, property: `)}: ${issue.message.toLowerCase()}`;
        }
        return `${path}: ${issue.message.toLowerCase()}`;
      });
    }

    const errorList = Array.isArray(exception.getResponse());

    if (errorList) {
      return exception.getResponse() as string[];
    }
    return [exception.message];
  }

  private getStatus(exception: HttpBaseException) {
    if (exception instanceof ZodError) {
      return ApiBadRequestException.STATUS;
    }

    return exception instanceof HttpException
      ? exception.getStatus()
      : [exception['status'], ApiInternalServerException.STATUS].find(Boolean);
  }
}
