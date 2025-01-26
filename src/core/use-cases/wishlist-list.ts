import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { ApiNotFoundException } from '@/utils/exceptions/http';
import { UserEntity } from '../entity/user';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistListInputSchema = WishlistEntitySchema.pick({
  user: true,
});

export class WishlistListUsecase implements IUsecase {
  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistListInputSchema)
  async execute(input: WishlistListInput): Promise<WishlistListOutput> {
    const model = (await this.repository.findOneWithExcludeFields(
      { user: { name: (input.user as UserEntity).name } },
      ['user'],
    )) as WishlistEntity;
    if (!model) {
      throw new ApiNotFoundException(
        `wishlist from user: ${(input.user as UserEntity).name} not found.`,
      );
    }
    const entity = new WishlistEntity(model);

    return entity;
  }
}

export type WishlistListInput = z.infer<typeof WishlistListInputSchema>;
export type WishlistListOutput = WishlistEntity;
