import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ISecretsAdapter } from './adapter';
import { EnvEnum } from './types';

@Injectable()
export class SecretsService implements ISecretsAdapter {
  constructor(private readonly config: ConfigService) {}

  IS_LOCAL = this.config.get<EnvEnum>('NODE_ENV') === EnvEnum.LOCAL;

  IS_PRODUCTION = this.config.get<EnvEnum>('NODE_ENV') === EnvEnum.PRD;

  ENV = this.config.get<EnvEnum>('NODE_ENV') as string;

  PORT = this.config.get<number>('PORT') as number;

  HOST = this.config.get('HOST');

  LOG_LEVEL = this.config.get('LOG_LEVEL');

  DATE_FORMAT = this.config.get('DATE_FORMAT');

  TZ = this.config.get('TZ');

  MONGO = {
    MONGO_URL: this.config.get('MONGO_URL'),
    MONGO_DATABASE: this.config.get('MONGO_DATABASE'),
  };

  TOKEN_EXPIRATION = this.config.get<number | string>('TOKEN_EXPIRATION') as string;
  REFRESH_TOKEN_EXPIRATION = this.config.get<number | string>('REFRESH_TOKEN_EXPIRATION') as string;

  JWT_SECRET_KEY = this.config.get('JWT_SECRET_KEY');
}
