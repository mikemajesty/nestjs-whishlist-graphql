import { IRepository } from '@/infra/repository';

import { WishlistEntity } from '../entity/wishlist';

export abstract class IWishlistRepository extends IRepository<WishlistEntity> {}
