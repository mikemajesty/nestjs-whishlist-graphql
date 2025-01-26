import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'products' })
export class Product {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string

  @Field(() => Number, { nullable: true })
  price?: number

  @Field(() => Number, { nullable: true })
  stock?: number

  @Field({ nullable: true })
  partner?: string
}