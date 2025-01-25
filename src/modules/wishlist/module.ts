import { IWishlistRepository } from '@/core/repository/wishlist';
import { WishlistCreateUsecase } from '@/core/use-cases/wishlist-create';
import { WishlistUpdateUsecase } from '@/core/use-cases/wishlist-update';
import { ConnectionName } from '@/infra/database/enum';
import { Wishlist, WishlistDocument, WishlistSchema } from '@/infra/database/mongo/schemas/wishlist';
import { LoggerModule } from '@/infra/logger';
import { TokenLibModule } from '@/libs/token';
import { AuthenticationMiddleware } from '@/middlewares/middlewares';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';
import { IWishlistCreateAdapter, IWishlistUpdateAdapter } from './adapter';
import { WishlistController } from './controller';
import { WishlistRepository } from './repository';


@Module({
  imports: [LoggerModule, TokenLibModule],
  controllers: [WishlistController],
  providers: [
    {
      provide: IWishlistRepository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<WishlistDocument>;

        const repository: PaginateModel<WishlistDocument> = connection.model<WishlistDocument, Model>(
          Wishlist.name,
          WishlistSchema as Schema
        );

        return new WishlistRepository(repository);
      },
      inject: [getConnectionToken(ConnectionName.WHITELIST)]
    },
    {
      provide: IWishlistCreateAdapter,
      useFactory(repository: IWishlistRepository) {
        return new WishlistCreateUsecase(repository)
      },
      inject: [IWishlistRepository]
    },
    {
      provide: IWishlistUpdateAdapter,
      useFactory(repository: IWishlistRepository) {
        return new WishlistUpdateUsecase(repository)
      },
      inject: [IWishlistRepository]
    }
  ],
  exports: [IWishlistRepository, IWishlistUpdateAdapter]
})
export class WishlistModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(WishlistController);
  }
}
