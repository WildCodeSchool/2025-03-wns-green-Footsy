import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Field, InputType, Resolver, Arg, Mutation } from "type-graphql";

import { User } from "../entities/User";
import UserService from "../services/UserService";

import type { UserServiceInterface } from "../services/UserService";

@InputType()
export class NewUserInput implements Partial<User> {
  @Field()
  fisrtName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date;

  @Field()
  avatarId: number;
}

function getUserPublicProfile(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.mail,
    birthDate: user.birthDate,
    avatarId: user.avatarId,
  };
}

type UserToken = {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  birthDate: Date;
  avatarId: number;
};

function getUserTokenContent(user: User): UserToken {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.mail,
    birthDate: user.birthDate,
    avatarId: user.avatarId,
  };
}

@Resolver(User)
export default class UserResolver {
  private userService: UserServiceInterface;

  constructor(userService: UserServiceInterface = new UserService()) {
    this.userService = userService;
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
