import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import { UserResolver } from './resolver';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: true,
    autoSchemaFile: 'schema.gql',
    formatError(formattedError, error): GraphQLFormattedError {
      return {
        message: formattedError.message ?? (error as { message?: string })?.message,
        path: formattedError.path,
      }
    },
  }),
  ],
  providers: [UserResolver],
  exports: []
})
export class GraphqlModule {}
