import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  WishlistUpdateInput,
  WishlistUpdateOutput,
} from '../../core/use-cases/wishlist-update';

import { IWishlistRepository } from '@/core/repository/wishlist';
import {
  WishlistCreateInput,
  WishlistCreateOutput,
} from '@/core/use-cases/wishlist-create';
import {
  WishlistListInput,
  WishlistListOutput,
} from '@/core/use-cases/wishlist-list';
import {
  WishlistProductExistsInput,
  WishlistProductExistsOutput,
} from '@/core/use-cases/wishlist-product-exists';
import {
  WishlistRemoveInput,
  WishlistRemoveOutput,
} from '@/core/use-cases/wishlist-remove';
import { ApiNotFoundException } from '@/utils/exceptions/http';
import { ApiRequest } from '@/utils/types';
import {
  IWishlistCreateAdapter,
  IWishlistListAdapter,
  IWishlistProductExistsAdapter,
  IWishlistRemoveAdapter,
  IWishlistUpdateAdapter,
} from './adapter';
import { SwaggerRequest, SwaggerResponse } from './swagger';

@Controller('wishlists')
@ApiTags('wishlists')
@ApiBearerAuth()
export class WishlistController {
  constructor(
    private readonly createWishlistUsecase: IWishlistCreateAdapter,
    private readonly updateWishlistUsecase: IWishlistUpdateAdapter,
    private readonly removeWishlistUsecase: IWishlistRemoveAdapter,
    private readonly listWishlistUsecase: IWishlistListAdapter,
    private readonly existsWishlistUsecase: IWishlistProductExistsAdapter,
    private readonly repository: IWishlistRepository,
  ) {}

  @Get('/products')
  @ApiResponse(SwaggerResponse.list[200])
  @ApiResponse(SwaggerResponse.list[404])
  async list(@Req() { body, user }: ApiRequest): Promise<WishlistListOutput> {
    const wishlistExists = await this.repository.findOne({
      user: { name: user.name.toUpperCase() },
    });
    if (wishlistExists) {
      return this.listWishlistUsecase.execute({
        ...body,
        user: user,
      } as WishlistListInput);
    }
    throw new ApiNotFoundException(
      `wishlist from user: ${user.name.toUpperCase()} not found.`,
    );
  }

  @Get('/products/:productName/exists')
  @ApiParam({ name: 'productName', required: true, allowEmptyValue: false })
  @ApiResponse(SwaggerResponse.exists[200])
  @ApiResponse(SwaggerResponse.exists[404])
  async exists(
    @Req() { params, user }: ApiRequest,
  ): Promise<WishlistProductExistsOutput> {
    const wishlistExists = await this.repository.findOne({
      user: { name: user.name.toUpperCase() },
    });
    if (wishlistExists) {
      return this.existsWishlistUsecase.execute({
        ...params,
        user: user,
      } as WishlistProductExistsInput);
    }
    throw new ApiNotFoundException(
      `wishlist from user: ${user.name.toUpperCase()} not found.`,
    );
  }

  @Post('/products')
  @ApiResponse(SwaggerResponse.create[201])
  @ApiBody(SwaggerRequest.create)
  @HttpCode(201)
  async create(
    @Req() { body, user }: ApiRequest,
  ): Promise<WishlistCreateOutput | WishlistUpdateOutput> {
    const wishlistExists = await this.repository.findOne({
      user: { name: user.name.toUpperCase() },
    });
    if (wishlistExists) {
      return this.updateWishlistUsecase.execute({
        name: body?.product?.name,
        user: user,
      } as WishlistUpdateInput);
    }
    return await this.createWishlistUsecase.execute({
      ...body,
      user: user,
    } as WishlistCreateInput);
  }

  @Put('/products')
  @ApiResponse(SwaggerResponse.update[200])
  @ApiResponse(SwaggerResponse.update[422])
  @ApiResponse(SwaggerResponse.update[404])
  @ApiResponse(SwaggerResponse.update[409])
  @ApiBody(SwaggerRequest.update)
  async update(
    @Req() { body, user }: ApiRequest,
  ): Promise<WishlistUpdateOutput> {
    const wishlistExists = await this.repository.findOne({
      user: { name: user.name.toUpperCase() },
    });
    if (wishlistExists) {
      return this.updateWishlistUsecase.execute({
        ...body,
        user: user,
      } as WishlistUpdateInput);
    }
    throw new ApiNotFoundException(
      `wishlist from user: ${user.name.toUpperCase()} not found.`,
    );
  }

  @Delete('/products/:productName')
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[404])
  @ApiParam({ name: 'productName', required: true, allowEmptyValue: false })
  async delete(
    @Req() { params, user }: ApiRequest,
  ): Promise<WishlistRemoveOutput> {
    const wishlistExists = await this.repository.findOne({
      user: { name: user.name.toUpperCase() },
    });
    if (wishlistExists) {
      return this.removeWishlistUsecase.execute({
        ...params,
        user: user,
      } as WishlistRemoveInput);
    }
    throw new ApiNotFoundException(
      `wishlist from user: ${user.name.toUpperCase()} not found.`,
    );
  }
}
