import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";

@InputType()
class UserInput {
  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  hashed_password: string;

  @Field()
  birthdate: Date;

  @Field()
  avatar_id: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    return User.find();
  }

  @Query(() => [User])
  async getUser(@Arg("id") id: number) {
    const user = await User.findOneByOrFail({id});
    return user;
  }
}