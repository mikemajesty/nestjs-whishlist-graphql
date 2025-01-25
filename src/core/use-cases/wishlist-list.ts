import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { ApiNotFoundException } from '@/utils/exceptions/http';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistListInputSchema = WishlistEntitySchema.pick({ user: true });

export class WishlistListUsecase implements IUsecase {

  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistListInputSchema)
  async execute(input: WishlistListInput): Promise<WishlistListOutput> {
    const model = await this.repository.findOneWithExcludeFields({ user: { name: input.user?.name } }, ["user"]) as WishlistEntity
    if (!model) {
      throw new ApiNotFoundException(`wishlist from user: ${input.user?.name} not found.`)
    }
    return new WishlistEntity(model)
  }
}

export type WishlistListInput = z.infer<typeof WishlistListInputSchema>;
export type WishlistListOutput = WishlistEntity;
