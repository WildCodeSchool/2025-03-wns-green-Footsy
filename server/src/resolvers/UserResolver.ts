import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { AvatarInput } from "./AvatarResolver";
import User from "../entities/User";
import UserService from "../services/UserService";

import type Avatar from "../entities/Avatar";
import type { UserServiceInterface } from "../services/UserService";

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

  @Query(() => User)
  async getUser(@Arg("id", () => Number) id: number) {
    const user = await User.findOneByOrFail({ id });
    return user;
  }

  @Mutation(() => String)
  async signup(@Arg("data", () => NewUserInput) userData: NewUserInput) {
    try {
      if (!process.env.JWT_SECRET)
        throw new Error("Missing env variable: JWT_SECRET");

      const hashedPassword = await argon2.hash(userData.password);

      const user = await this.userService.create({
        ...userData,
        password: hashedPassword,
      });
      const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);
      return `${getUserPublicProfile(user)}; token=${token}`;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
