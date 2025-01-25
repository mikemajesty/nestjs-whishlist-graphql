import { z } from 'zod';

import { ProductEntity, ProductEntitySchema } from '@/core/entity/product';
import { UserEntity, UserEntitySchema } from '@/core/entity/user';
import { BaseEntity } from '@/utils/entity';
import { ApiConflictException, ApiUnprocessableEntityException } from '@/utils/exceptions/http';

const ID = z.string().uuid();
const User = UserEntitySchema;
const Name = z.string()
const Product = ProductEntitySchema;
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const WishlistEntitySchema = z.object({
  id: ID,
  user: User.optional(),
  name: Name,
  products: z.array(Product).max(20),
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Wishlist = z.infer<typeof WishlistEntitySchema>;

export class WishlistEntity extends BaseEntity<WishlistEntity>() {

  static MAX_PRODUCT_LIMIT = 20

  name!: string

  user!: UserEntity;

  products: ProductEntity[] = [];

  addProducts(product: ProductEntity) {
    const productExists = this.products.find(p => p.name === product.name);
    if (productExists) {
      throw new ApiConflictException(`product: ${product.name} already on the list.`)
    }
    this.products.push(new ProductEntity({ name: product.name }))
  }

  isMaxLimitProduct() {
    if (this.products.length === WishlistEntity.MAX_PRODUCT_LIMIT) {
      throw new ApiUnprocessableEntityException(`product max limit id: ${WishlistEntity.MAX_PRODUCT_LIMIT}`)
    }
  }

  constructor(entity: Wishlist) {
    super(WishlistEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
