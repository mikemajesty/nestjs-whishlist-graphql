import { Module } from '@nestjs/common';

import { MongoDatabaseModule } from './database/mongo';
import { GraphqlModule } from './graphql/module';
import { LoggerModule } from './logger';
import { SecretsModule } from './secrets';

@Module({
  imports: [SecretsModule, MongoDatabaseModule, LoggerModule, GraphqlModule],
  providers: [],
  exports: [SecretsModule, MongoDatabaseModule, LoggerModule, GraphqlModule],
})
export class InfraModule {}
