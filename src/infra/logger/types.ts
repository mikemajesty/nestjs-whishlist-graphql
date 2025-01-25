import { HttpBaseException } from '@/utils/exceptions/http';

export type MessageType = {
  message: string;
  context?: string;
  obj?: object;
};

export type ErrorType = Error & HttpBaseException;

export enum LogLevelEnum {
  fatal = 'fatal',
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
  trace = 'trace',
  silent = 'silent'
}
