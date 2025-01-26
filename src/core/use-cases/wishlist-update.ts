import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

import { ApiNotFoundException } from '@/utils/exceptions/http';
import { ProductEntity, ProductEntitySchema } from '../entity/product';
import { UserEntity } from '../entity/user';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistUpdateInputSchema = WishlistEntitySchema.pick({
  user: true,
}).merge(ProductEntitySchema.pick({ name: true }));

export class WishlistUpdateUsecase implements IUsecase {
  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistUpdateInputSchema)
  async execute(input: WishlistUpdateInput): Promise<WishlistUpdateOutput> {
    const wishlist = await this.repository.findOne({
      user: { name: (input.user as UserEntity).name },
    });
    if (!wishlist) {
      throw new ApiNotFoundException(
        `wishlist from user: ${(input.user as UserEntity).name} not found.`,
      );
    }

    const entity = new WishlistEntity(wishlist);

    entity.addProduct(new ProductEntity({ name: input.name }));

    entity.isMaxLimitProduct();

    await this.repository.updateOne({ id: wishlist.id }, entity);

    const model = (await this.repository.findOneWithExcludeFields(
      { id: wishlist.id },
      ['user'],
    )) as WishlistEntity;
    return new WishlistEntity(model);
  }
}

export type WishlistUpdateInput = z.infer<typeof WishlistUpdateInputSchema>;
export type WishlistUpdateOutput = Omit<WishlistEntity, 'user'>;
