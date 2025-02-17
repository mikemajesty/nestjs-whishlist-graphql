import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { IWishlistCreateAdapter } from '@/modules/wishlist/adapter';
import { UUIDUtils } from '@/utils/uuid';
import { ProductEntity, ProductEntitySchema } from '../entity/product';
import { UserEntity } from '../entity/user';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistCreateInputSchema = WishlistEntitySchema.pick({
  user: true,
  name: true,
}).merge(z.object({ product: ProductEntitySchema.pick({ name: true }) }));

export class WishlistCreateUsecase implements IWishlistCreateAdapter {
  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistCreateInputSchema)
  async execute(input: WishlistCreateInput): Promise<WishlistCreateOutput> {
    const entity = new WishlistEntity({
      id: UUIDUtils.create(),
      name: input.name,
      user: input.user,
      products: [new ProductEntity({ name: input.product.name })],
    });

    const user = new UserEntity(entity.user);
    user.createPassword();
    entity.user = user;

    await this.repository.create(entity);
    const model = (await this.repository.findOneWithExcludeFields(
      { id: entity.id },
      ['user'],
    )) as WishlistEntity;
    return new WishlistEntity(model);
  }
}

export type WishlistCreateInput = z.infer<typeof WishlistCreateInputSchema>;
export type WishlistCreateOutput = Omit<WishlistEntity, 'user'>;
