import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'users' })
export class User {
  @Field()
  id?: string;

  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field(() => Int)
  age!: number;

  @Field()
  createdDate!: Date;
}