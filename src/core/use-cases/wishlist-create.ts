import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { IWishlistCreateAdapter } from '@/modules/wishlist/adapter';
import { UUIDUtils } from '@/utils/uuid';
import { ProductEntity, ProductEntitySchema } from '../entity/product';
import { UserEntity } from '../entity/user';
import { WishlistEntity, WishlistEntitySchema } from '../entity/wishlist';
import { IWishlistRepository } from '../repository/wishlist';

export const WishlistCreateInputSchema = WishlistEntitySchema.pick({ user: true, name: true }).merge(z.object({ product: ProductEntitySchema.pick({ name: true }) }));

export class WishlistCreateUsecase implements IWishlistCreateAdapter {
  constructor(private readonly repository: IWishlistRepository) {}

  @ValidateSchema(WishlistCreateInputSchema)
  async execute(input: WishlistCreateInput): Promise<WishlistCreateOutput> {
    const entity = new WishlistEntity({ id: UUIDUtils.create(), ...input, products: [new ProductEntity({ name: input.product.name })] })
    entity.isMaxLimitProduct()

    const user = new UserEntity(entity.user)
    user.createPassword()
    entity.user = user

    await this.repository.create(entity)
  }
}

const Output = WishlistCreateInputSchema.omit({ user: true })
export type WishlistCreateInput = z.infer<typeof Output>;
export type WishlistCreateOutput = void;
