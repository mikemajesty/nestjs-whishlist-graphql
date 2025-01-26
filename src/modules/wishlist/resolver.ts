import { UserEntity } from '@/core/entity/user';
import { Product } from '@/infra/database/mongo/schemas/product';
import { Wishlist } from '@/infra/database/mongo/schemas/wishlist';
import { GraphqlAuthenticationInterceptor } from '@/middlewares/middlewares/graphql.middleware';
import { UseInterceptors } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { IWishlistListAdapter, IWishlistProductExistsAdapter } from './adapter';

@Resolver(() => Wishlist)
export class WishlistResolver {
  constructor(
    private readonly listWishlistUsecase: IWishlistListAdapter,
    private readonly existsWishlistUsecase: IWishlistProductExistsAdapter,
  ) {}

  @Query(() => Product)
  @UseInterceptors(GraphqlAuthenticationInterceptor)
  async productExists(
    @Args('name', { type: () => String }) productName: string,
    @Context() ctx: { req: { user: UserEntity } },
  ) {
    return this.existsWishlistUsecase.execute({
      productName,
      user: ctx.req.user,
    });
  }

  @Query(() => Wishlist)
  @UseInterceptors(GraphqlAuthenticationInterceptor)
  async productList(@Context() ctx: { req: { user: UserEntity } }) {
    return this.listWishlistUsecase.execute({ user: ctx.req.user });
  }
}
