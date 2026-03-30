import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import type { ServerResponse } from "http";

import type Avatar from "../entities/Avatar";
import User from "../entities/User";
import type { UserServiceInterface } from "../services/UserService";
import UserService from "../services/UserService";
import { AvatarInput } from "./AvatarResolver";
import {
  NewUserInputSchema,
  UserInputSchema,
  UpdatePersonalInfoInputSchema,
} from "../schemas/user.schema";

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

  @Field(() => String)
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
    isAdmin: user.isAdmin,
  };
}

type UserToken = {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  birthDate: Date;
  avatar: Avatar;
  isAdmin: boolean;
};

function getUserTokenContent(user: User): UserToken {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    mail: user.email,
    birthDate: user.birthdate,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
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
    return User.find({ relations: ["avatar"] });
  }

  @Query(() => User)
  async getUserById(@Arg("id", () => Int) id: number) {
    const user = await User.findOneByOrFail({ id });
    return user;
  }

  @Query(() => User, { nullable: true })
  async currentUser(
    @Ctx() context: { token: string | null },
  ): Promise<User | null> {
    try {
      if (!context.token || !process.env.JWT_SECRET) {
        return null;
      }

      const decoded = jwt.verify(context.token, process.env.JWT_SECRET) as {
        id: number;
      };

      return await User.findOne({
        where: { id: decoded.id },
        relations: ["avatar"],
      });
    } catch {
      return null;
    }
  }

  @Mutation(() => String)
  async signup(
    @Arg("data", () => NewUserInput) userData: NewUserInput,
    @Ctx() { res }: { res: ServerResponse },
  ) {
    try {
      // Validate input with Zod (validates all fields including avatar)
      const parsed = NewUserInputSchema.safeParse(userData);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Invalid input");
      }

      if (!process.env.JWT_SECRET)
        throw new Error("Missing env variable: JWT_SECRET");

      const hashedPassword = await argon2.hash(parsed.data.password);

      const user = await this.userService.create({
        ...parsed.data,
        password: hashedPassword,
      });
      const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);
      // This is to avoid a security issue in development mode when using localhost. In production, the Secure flag will be set.
      const isProduction = process.env.IS_PRODUCTION === "true";
      res.setHeader(
        "Set-Cookie",
        `jwt=${token}; HttpOnly; ${isProduction ? "Secure;" : ""} SameSite=Strict; Path=/`,
      );

      return JSON.stringify(getUserPublicProfile(user));
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("duplicate key"))
        throw new Error("Email already in use");
      throw new Error("Signup error");
    }
  }

  @Mutation(() => String)
  async login(
    @Arg("data", () => UserInput) userData: UserInput,
    @Ctx() { res }: { res: ServerResponse },
  ) {
    try {
      // Validate input with Zod
      const parsed = UserInputSchema.safeParse(userData);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Invalid input");
      }

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set in the environment variables.");
        throw new Error("Missing env variable: JWT_SECRET");
      }

      const user = await this.userService.authenticateUser(
        parsed.data.email,
        parsed.data.password,
      );

      if (!user) {
        console.error(
          "Authentication failed: User not found or invalid credentials.",
        );
        throw new Error("Incorrect email or password");
      }

      const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);

      try {
        const isProduction = process.env.IS_PRODUCTION === "true";
        res.setHeader(
          "Set-Cookie",
          `jwt=${token}; HttpOnly; ${isProduction ? "Secure;" : ""} SameSite=Strict; Path=/`,
        );
      } catch (cookieError) {
        console.error("Error setting cookie:", cookieError);
        throw new Error("Failed to set authentication cookie.");
      }

      return JSON.stringify(getUserPublicProfile(user));
    } catch (err) {
      console.error("Error in login method:", err);
      throw new Error("Login error");
    }
  }

  @Mutation(() => User)
  async updatePersonalInfo(
    @Arg("userId", () => Int) userId: number,
    @Arg("data", () => UpdatePersonalInfoInput) data: UpdatePersonalInfoInput,
  ): Promise<User> {
    try {
      // Validate input with Zod (validates all fields including avatar)
      const parsed = UpdatePersonalInfoInputSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Invalid input");
      }

      return await this.userService.updatePersonalInfo(userId, parsed.data);
    } catch (error) {
      console.error("Error updating personal info:", error);
      if (error instanceof Error) {
        throw new Error(
          `Failed to update personal information: ${error.message}`,
        );
      }
      throw new Error("Failed to update personal information");
    }
  }

  @Mutation(() => User)
  async updateAvatar(
    @Arg("userId", () => Int) userId: number,
    @Arg("data", () => UpdateAvatarInput) data: UpdateAvatarInput,
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.updateAvatar(
        userId,
        data.avatar_id,
      );

      if (!updatedUser) {
        throw new Error("Failed to update avatar");
      }

      return updatedUser;
    } catch {
      throw new Error("Failed to update avatar");
    }
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("userId", () => Int) userId: number,
    @Arg("data", () => ChangePasswordInput) data: ChangePasswordInput,
  ): Promise<boolean> {
    try {
      await this.userService.changePassword(
        userId,
        data.current_password,
        data.new_password,
      );
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      if (
        error instanceof Error &&
        error.message.includes("Current password is incorrect")
      ) {
        throw new Error("Current password is incorrect");
      }
      throw new Error("Failed to change password");
    }
  }

  @Mutation(() => Boolean)
  async deleteAccount(
    @Arg("userId", () => Int) userId: number,
    @Ctx() context: { token: string | null },
  ): Promise<boolean> {
    try {
      if (!context.token || !process.env.JWT_SECRET) {
        throw new Error("Unauthorized: Authentication required");
      }

      const decoded = jwt.verify(context.token, process.env.JWT_SECRET) as {
        id: number;
      };

      if (decoded.id !== userId) {
        throw new Error("Unauthorized: You can only delete your own account");
      }

      return await this.userService.deleteAccount(userId);
    } catch (error) {
      console.error("Error deleting account:", error);
      if (
        error instanceof Error &&
        (error.message.includes("Unauthorized") ||
          error.message.includes("Authentication required"))
      ) {
        throw error;
      }
      throw new Error("Failed to delete account");
    }
  }

  @Mutation(() => Boolean)
  async deleteUserByAdmin(
    @Arg("userId", () => Int) userId: number,
    @Ctx() context: { token: string | null },
  ): Promise<boolean> {
    try {
      if (!context.token || !process.env.JWT_SECRET) {
        throw new Error("Unauthorized: Authentication required");
      }

      const decodedJWT = jwt.verify(context.token, process.env.JWT_SECRET) as {
        id: number;
      };

      const requestingUser = await User.findOneByOrFail({ id: decodedJWT.id });
      if (!requestingUser.isAdmin) {
        throw new Error("Unauthorized: Only admins can delete users");
      }

      return await this.userService.deleteAccount(userId);
    } catch {
      throw new Error("Failed to delete user");
    }
  }

  @Mutation(() => User)
  async toggleUserAdminStatus(
    @Arg("userId", () => Int) userId: number,
    @Ctx() context: { token: string | null },
  ): Promise<User> {
    try {
      if (!context.token || !process.env.JWT_SECRET) {
        throw new Error("Unauthorized: Authentication required");
      }

      const decodedJWT = jwt.verify(context.token, process.env.JWT_SECRET) as {
        id: number;
      };

      const requestingUser = await User.findOneByOrFail({ id: decodedJWT.id });
      if (!requestingUser.isAdmin) {
        throw new Error(
          "Unauthorized: Only admins can modify user admin status",
        );
      }

      return await this.userService.toggleAdminStatus(userId);
    } catch {
      throw new Error("Failed to toggle user admin status");
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: { res: ServerResponse }): Promise<boolean> {
    try {
      res.setHeader(
        "Set-Cookie",
        "jwt=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
      );
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      throw new Error("Failed to logout");
    }
  }
}
