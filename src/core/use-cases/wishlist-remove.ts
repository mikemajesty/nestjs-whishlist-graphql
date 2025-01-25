import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { ApiNotFoundException } from '@/utils/exceptions/http';
import { ProductEntity } from '../entity/product';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistRemoveInputSchema = WishlistEntitySchema.pick({ user: true }).merge(z.object({ productName: z.string().transform(n => n.toUpperCase()) }));

export class WishlistRemoveUsecase implements IUsecase {

  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistRemoveInputSchema)
  async execute(input: WishlistRemoveInput): Promise<WishlistRemoveOutput> {
    const wishlist = await this.repository.findOne({ user: { name: input.user?.name } })
    if (!wishlist) {
      throw new ApiNotFoundException(`wishlist from user: ${input.user?.name} not found.`)
    }

    const entity = new WishlistEntity(wishlist)
    entity.removeProduct(new ProductEntity({ name: input.productName }))

    await this.repository.updateOne({ id: wishlist.id }, entity)

    const model = await this.repository.findOneWithExcludeFields({ id: entity.id }, ['user']) as WishlistEntity
    return new WishlistEntity(model)
  }
}

export type WishlistRemoveInput = z.infer<typeof WishlistRemoveInputSchema>;
export type WishlistRemoveOutput = Omit<WishlistEntity, 'user'>;
