import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { AvatarInput } from "./AvatarResolver";
import User from "../entities/User";
import UserService from "../services/UserService";

import type Avatar from "../entities/Avatar";
import type { UserServiceInterface } from "../services/UserService";

@InputType()
export class NewUserInput {
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Date)
  birthdate: Date;

  @Field(() => AvatarInput)
  avatar: AvatarInput;
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

@InputType()
export class UserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class LoginResponse {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
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

  @Query(() => User)
  async getUser(@Arg("id", () => Int) id: number) {
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
      if (err instanceof Error && err.message.includes("duplicate key"))
        throw new Error("Email already in use");
      throw new Error("Signup error");
    }
  }

  @Mutation(() => String)
  async login(@Arg("data", () => UserInput) userData: UserInput) {
    try {
      if (!process.env.JWT_SECRET)
        throw new Error("Missing env variable: JWT_SECRET");

      const user = await this.userService.authenticateUser(
        userData.email,
        userData.password
      );

      if (!user) {
        throw new Error("Incorrect email or password");
      }

      const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);

      return `${JSON.stringify(getUserPublicProfile(user))}; token=${token}`;
    } catch (err) {
      console.error(err);
      throw new Error("Login error");
    }
  }
}
