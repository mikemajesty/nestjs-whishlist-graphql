export abstract class ISecretsAdapter {
  ENV!: string;

  PORT!: number | string;

  HOST!: string;

  LOG_LEVEL!: string;

  DATE_FORMAT!: string;

  TZ!: string;

  MONGO!: {
    MONGO_URL: string;
    MONGO_DATABASE: string;
  };

  TOKEN_EXPIRATION!: number | string;
  REFRESH_TOKEN_EXPIRATION!: number | string;

  JWT_SECRET_KEY!: string;

  IS_LOCAL!: boolean;

  IS_PRODUCTION!: boolean;
}
