import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { User } from "../entities/User";
import UserService from "../services/UserService";

import type { Avatar } from "../entities/Avatar";
import type { UserServiceInterface } from "../services/UserService";

@InputType()
class NewUserInput implements Partial<User> {
  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  birthdate: Date;

  @Field()
  avatar: Avatar;
}

function getUserPublicProfile(user: User) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    mail: user.email,
    birthDate: user.birthdate,
    avatar: user.avatar,
  };
}

type UserToken = {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  birthDate: Date;
  avatar: Avatar;
};

function getUserTokenContent(user: User): UserToken {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    mail: user.email,
    birthDate: user.birthdate,
    avatar: user.avatar,
  };
}

@Resolver(User)
export default class UserResolver {
  private userService: UserServiceInterface;

  constructor(userService: UserServiceInterface = new UserService()) {
    this.userService = userService;
  }

  @Query(() => [User])
  async getAllUsers() {
    return User.find();
  }

  @Query(() => [User])
  async getUser(@Arg("id") id: number) {
    const user = await User.findOneByOrFail({ id });
    return user;
  }

  @Mutation(() => String)
  async signup(@Arg("data") userData: NewUserInput) {
    try {
      if (!process.env.JWT_SECRET)
        throw new Error("Missing env variable: JWT_SECRET");

      const hashedPassword = await argon2.hash(userData.password);

      const user = await this.userService.create({
        ...userData,
        hashedPassword: hashedPassword,
      });
      const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);
      return `${getUserPublicProfile(user)}; token=${token}`;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
