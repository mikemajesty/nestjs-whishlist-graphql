
import { ApiGraphqlNotFoundException } from '@/utils/exceptions/graphql';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './schemas/user';


@Resolver(() => User)
export class UserResolver {
  private users: User[] = []
  constructor() {
    const user = new User();
    user.id = '1';
    user.firstname = 'Ava';
    user.lastname = 'Brown';
    user.age = 20;
    user.createdDate = new Date();
    this.users.push(user)
  }

  @Query(() => User)
  async getUserById(@Args('id', { type: () => String }) id: string) {
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new ApiGraphqlNotFoundException("user not found")
    }
    return user
  }
}