import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WishlistUpdateInput, WishlistUpdateOutput } from '../../core/use-cases/wishlist-update';

import { IWishlistRepository } from '@/core/repository/wishlist';
import { WishlistCreateInput, WishlistCreateOutput } from '@/core/use-cases/wishlist-create';
import { ApiRequest } from '@/utils/types';
import { IWishlistCreateAdapter, IWishlistUpdateAdapter } from './adapter';
import { SwaggerRequest, SwaggerResponse } from './swagger';

@Controller('wishlists')
@ApiTags('wishlists')
@ApiBearerAuth()
export class WishlistController {
  constructor(
    private readonly createWishlistUsecase: IWishlistCreateAdapter,
    private readonly updateWishlistUsecase: IWishlistUpdateAdapter,
    private readonly repository: IWishlistRepository,
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[201])
  @ApiBody(SwaggerRequest.create)
  @HttpCode(201)
  async create(@Req() { body, user }: ApiRequest): Promise<WishlistCreateOutput | WishlistUpdateOutput> {
    const wishlistExists = await this.repository.findOne({ user: { name: user.name.toUpperCase() } })
    if (wishlistExists) {
      return this.updateWishlistUsecase.execute({ ...body, user: user } as WishlistUpdateInput)
    }
    return await this.createWishlistUsecase.execute({ ...body, user: user } as WishlistCreateInput);
  }
}
