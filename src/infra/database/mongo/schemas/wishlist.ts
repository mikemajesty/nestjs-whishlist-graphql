import { ProductEntity } from '@/core/entity/product';
import { UserEntity } from '@/core/entity/user';
import { WishlistEntity } from '@/core/entity/wishlist';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Product } from './product';
import { User } from './user';

export type WishlistDocument = Document & WishlistEntity;

@Schema({
  collection: 'wishlists',
  autoIndex: true,
  timestamps: true,
})
@ObjectType({ description: 'wishlists' })
export class Wishlist {
  @Field()
  @Prop({ type: String })
  _id!: string;

  @Field({ nullable: true })
  @Prop({ required: true, type: String })
  name!: string;

  @Field(() => User, { nullable: true })
  @Prop({ required: true, type: SchemaType.Types.Mixed })
  user!: UserEntity;

  @Field(() => [Product], { nullable: true })
  @Prop({ min: 0, max: 200, required: true, type: [SchemaType.Types.Mixed] })
  products!: Array<ProductEntity>;

  @Field({ nullable: true })
  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ 'client.password': 1, 'client.name': 1 });
WishlistSchema.index({ 'products.name': 1 });

WishlistSchema.plugin(paginate);

WishlistSchema.virtual('id').get(function () {
  return this._id;
});

export { WishlistSchema };
