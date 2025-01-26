import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'users' })
export class User {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  password?: string;
}