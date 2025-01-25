import { WishlistEntity } from '@/core/entity/wishlist';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export type WishlistDocument = Document & WishlistEntity;

@Schema({
  collection: 'wishlists',
  autoIndex: true,
  timestamps: true
})
export class Wishlist {
  @Prop({ type: String })
  _id!: string;

  @Prop({ required: true, type: String })
  name!: string

  @Prop({ required: true, type: SchemaType.Types.Mixed })
  user!: unknown;

  @Prop({ min: 0, max: 200, required: true, type: [SchemaType.Types.Mixed] })
  products!: unknown[];

  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ "client.password": 1, "client.name": 1 });
WishlistSchema.index({ "products.name": 1 });

WishlistSchema.plugin(paginate);

WishlistSchema.virtual('id').get(function () {
  return this._id;
});

export { WishlistSchema };
