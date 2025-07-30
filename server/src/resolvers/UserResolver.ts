import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import User from "../entities/User";

@InputType()
class UserInput {
  @Field(()=> String)
  first_name: string;

  @Field(()=> String)
  last_name: string;

  @Field(()=> String)
  email: string;

  @Field(()=> String)
  hashed_password: string;

  @Field(()=> Date)
  birthdate: Date;

  @Field(()=> String)
  avatar: string;
}

@Resolver(User)
export default class UserResolver {
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