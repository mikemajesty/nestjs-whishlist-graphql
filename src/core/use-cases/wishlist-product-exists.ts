import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { ApiNotFoundException } from '@/utils/exceptions/http';
import { ProductEntity } from '../entity/product';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistProductExistsInputSchema = WishlistEntitySchema.pick({ user: true }).merge(z.object({ productName: z.string().transform(n => n.toUpperCase()) }));

export class WishlistProductExistsUsecase implements IUsecase {
  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistProductExistsInputSchema)
  async execute(input: WishlistProductExistsInput): Promise<WishlistProductExistsOutput> {
    const model = await this.repository.findOneWithExcludeFields({ user: { name: input.user?.name } }, ["user"]) as WishlistEntity
    if (!model) {
      throw new ApiNotFoundException(`wishlist from user: ${input.user?.name} not found.`)
    }

    const entity = new WishlistEntity(model)
    return entity.existProduct(new ProductEntity({ name: input.productName }))
  }
}

export type WishlistProductExistsInput = z.infer<typeof WishlistProductExistsInputSchema>;
export type WishlistProductExistsOutput = ProductEntity;
