import { WishlistModule } from '@/modules/wishlist/module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';
import { GraphQLFormattedError } from 'graphql';
import { ZodIssue } from 'zod';
@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: true,
    autoSchemaFile: 'schema.gql',
    formatError(formattedError, error): GraphQLFormattedError {
      if (((error as ({ stack?: string }))?.stack || '')?.includes("ZodError")) {
        const validationError = JSON.parse(formattedError.message)
        return {
          message: validationError.map((v: ZodIssue) => `${v?.path.join(".")}: ${v.message}`).join(","),
          path: formattedError.path,
        }
      }
      return {
        message: formattedError.message ?? (error as { message?: string })?.message,
        path: formattedError.path,
      }
    },
    context: ({ req }: { req: Request }) => {
      const token = req.headers.authorization;
      Object.assign(req, { token })
      return { req }
    }
  }),
  ],
  providers: [WishlistModule],
  exports: []
})
export class GraphqlModule {}
