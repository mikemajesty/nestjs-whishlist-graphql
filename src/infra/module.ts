import { Module } from '@nestjs/common';

import { MongoDatabaseModule } from './database/mongo';
import { LoggerModule } from './logger';
import { SecretsModule } from './secrets';

@Module({
  imports: [
    SecretsModule,
    MongoDatabaseModule,
    LoggerModule,
  ],
  exports: [SecretsModule,
    MongoDatabaseModule,
    LoggerModule]
})
export class InfraModule { }
