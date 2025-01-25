import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { ProductEntitySchema } from '../entity/product';
import { WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistUpdateInputSchema = WishlistEntitySchema.pick({ id: true, name: true, user: true }).merge(z.object({ product: ProductEntitySchema.pick({ name: true }) }));

export class WishlistUpdateUsecase implements IUsecase {
  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistUpdateInputSchema)
  async execute(input: WishlistUpdateInput): Promise<WishlistUpdateOutput> {
    const wishlist = await this.repository.findOne({ user: { name: input.name } })
    return input;
  }
}

const Output = WishlistUpdateInputSchema.omit({ user: true })
export type WishlistUpdateInput = z.infer<typeof Output>;
export type WishlistUpdateOutput = WishlistUpdateInput;
