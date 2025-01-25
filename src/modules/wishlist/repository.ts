import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { IWishlistRepository } from '@/core/repository/wishlist';
import { Wishlist, WishlistDocument } from '@/infra/database/mongo/schemas/wishlist';
import { MongoRepository } from '@/infra/repository';

@Injectable()
export class WishlistRepository extends MongoRepository<WishlistDocument> implements IWishlistRepository {
  constructor(@InjectModel(Wishlist.name) readonly entity: PaginateModel<WishlistDocument>) {
    super(entity);
  }
}
