import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z, ZodError, ZodIssue } from 'zod';

import { ApiInternalServerException } from '@/utils/exceptions/http';
import { ZodInferSchema } from '@/utils/types';

import { LogLevelEnum } from '../logger';
import { ISecretsAdapter } from './adapter';
import { SecretsService } from './service';
import { EnvEnum } from './types';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    })
  ],
  providers: [
    {
      provide: ISecretsAdapter,
      useFactory: (config: ConfigService) => {
        const SecretsSchema = z.object<ZodInferSchema<ISecretsAdapter>>({
          ENV: z.nativeEnum(EnvEnum),
          HOST: z.string(),
          IS_LOCAL: z.boolean(),
          IS_PRODUCTION: z.boolean(),
          JWT_SECRET_KEY: z.string(),
          LOG_LEVEL: z.nativeEnum(LogLevelEnum),
          DATE_FORMAT: z.string(),
          TZ: z.string(),
          MONGO: z.object({
            MONGO_URL: z.string(),
            MONGO_DATABASE: z.string(),
          }),
          PORT: z
            .number()
            .or(z.string())
            .transform((p) => Number(p)),
          TOKEN_EXPIRATION: z.string().or(z.number()),
          REFRESH_TOKEN_EXPIRATION: z.string().or(z.number())
        });
        const secret = new SecretsService(config);

        try {
          SecretsSchema.parse(secret);
        } catch (error) {
          const zodError = error as ZodError;
          const message = zodError.issues
            .map((i: ZodIssue) => `${SecretsService.name}.${i.path.join('.')}: ${i.message}`)
            .join(',');
          throw new ApiInternalServerException(message);
        }

        return SecretsSchema.parse(secret);
      },
      inject: [ConfigService]
    }
  ],
  exports: [ISecretsAdapter]
})
export class SecretsModule {}
