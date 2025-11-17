import * as argon2 from "argon2";
import jwt, { Secret } from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  ObjectType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import type Avatar from "../entities/Avatar";
import User from "../entities/User";
import type { UserServiceInterface } from "../services/UserService";
import UserService from "../services/UserService";
import { AvatarInput } from "./AvatarResolver";

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

type UserToken = { id: number };

function getUserTokenContent(user: User): UserToken {
  return { id: user.id };
}

@InputType()
export class UserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}

@InputType()
export class UpdatePersonalInfoInput {
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => Date)
  birthdate: Date;
}

@InputType()
export class UpdateAvatarInput {
  @Field(() => Int)
  avatar_id: number;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  current_password: string;

  @Field(() => String)
  new_password: string;
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
  async getUserById(@Arg("id", () => Int) id: number) {
    const user = await User.findOneByOrFail({ id });
    return user;
  }

  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() context: { token: string | null }): Promise<User | null> {
    try {
      if (!context.token || !process.env.JWT_SECRET) {
        return null;
      }

      const decoded = jwt.verify(context.token, process.env.JWT_SECRET) as { id: number };
      
      return await User.findOne({
        where: { id: decoded.id },
        relations: ["avatar"]
      });
    } catch {
      return null;
    }
  }

  @Mutation(() => LoginResponse)
  async signup(@Arg("data", () => NewUserInput) userData: NewUserInput): Promise<LoginResponse> {
    try {
      if (!process.env.JWT_SECRET)
        throw new Error("Missing env variable: JWT_SECRET");

      const hashedPassword = await argon2.hash(userData.password);

      const user = await this.userService.create({
        ...userData,
        password: hashedPassword,
      });

      // compute exp claim ourselves to avoid type overload issues with jwt.sign options
      const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS || "604800", 10); // default 7 days
      const payload = { ...getUserTokenContent(user), exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
      const token = jwt.sign(payload, process.env.JWT_SECRET as Secret);

      return { token, user };
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("duplicate key"))
        throw new Error("Email already in use");
      throw new Error("Signup error");
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("data", () => UserInput) userData: UserInput): Promise<LoginResponse> {
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

      const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS || "604800", 10); // default 7 days
      const payload = { ...getUserTokenContent(user), exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
      const token = jwt.sign(payload, process.env.JWT_SECRET as Secret);

      return { token, user };
    } catch (err) {
      console.error(err);
      throw new Error("Login error");
    }
  }

  @Mutation(() => User)
  async updatePersonalInfo(
    @Arg("userId", () => Int) userId: number,
    @Arg("data", () => UpdatePersonalInfoInput) data: UpdatePersonalInfoInput
  ): Promise<User> {
    try {
      return await this.userService.updatePersonalInfo(userId, data);
    } catch (error) {
      console.error("Error updating personal info:", error);
      throw new Error("Failed to update personal information");
    }
  }


  @Mutation(() => User)
  async updateAvatar(
    @Arg("userId", () => Int) userId: number,
    @Arg("data", () => UpdateAvatarInput) data: UpdateAvatarInput
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.updateAvatar(userId, data.avatar_id);

      if (!updatedUser) {
        throw new Error("Failed to update avatar");
      }

      return updatedUser;
    } catch (error) {
      throw new Error("Failed to update avatar");
    }
  }


  @Mutation(() => Boolean)
  async changePassword(
    @Arg("userId", () => Int) userId: number,
    @Arg("data", () => ChangePasswordInput) data: ChangePasswordInput
  ): Promise<boolean> {
    try {
      await this.userService.changePassword(userId, data.current_password, data.new_password);
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      if (error instanceof Error && error.message.includes("Current password is incorrect")) {
        throw new Error("Current password is incorrect");
      }
      throw new Error("Failed to change password");
    }
  }

  @Mutation(() => Boolean)
  async deleteAccount(@Arg("userId", () => Int) userId: number): Promise<boolean> {
    try {
      return await this.userService.deleteAccount(userId);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw new Error("Failed to delete account");
    }
  }
}