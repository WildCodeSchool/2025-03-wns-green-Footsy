import * as argon2 from "argon2";
import Activity from "../entities/Activity";
import Avatar from "../entities/Avatar";
import Friend from "../entities/Friend";
import Interaction from "../entities/Interaction";
import User from "../entities/User";

import type {
  NewUserInput,
  UpdatePersonalInfoInput,
} from "../resolvers/UserResolver";

export interface UserServiceInterface {
  create(data: NewUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  authenticateUser(email: string, password: string): Promise<User>;
  updatePersonalInfo(
    userId: number,
    data: UpdatePersonalInfoInput
  ): Promise<User>;
  updateAvatar(userId: number, avatarId: number): Promise<User>;
  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<User>;
  deleteAccount(userId: number): Promise<boolean>;
  toggleAdminStatus(userId: number): Promise<User>;
}

export default class UserService implements UserServiceInterface {
  async create(data: NewUserInput): Promise<User> {
    const user = User.create({ ...data, hashed_password: data.password });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
      relations: ["avatar"],
    });
  }

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await argon2.verify(user.hashed_password, password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    return user;
  }

  async updatePersonalInfo(
    userId: number,
    data: UpdatePersonalInfoInput
  ): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });

    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.birthdate =
      data.birthdate instanceof Date
        ? data.birthdate
        : new Date(data.birthdate);

    return user.save();
  }

  async updateAvatar(userId: number, avatarId: number): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });
    const avatar = await Avatar.findOneByOrFail({ id: avatarId });

    user.avatar = avatar;
    return user.save();
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });

    const isValidCurrentPassword = await argon2.verify(
      user.hashed_password,
      currentPassword
    );
    if (!isValidCurrentPassword) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await argon2.hash(newPassword);

    user.hashed_password = hashedNewPassword;

    return user.save();
  }

  async deleteAccount(userId: number): Promise<boolean> {
    const user = await User.findOneByOrFail({ id: userId });

    const activities = await Activity.find({
      where: { user: { id: userId } },
      relations: ["interactions"],
    });

    for (const activity of activities) {
      if (activity.interactions && activity.interactions.length > 0) {
        await Interaction.remove(activity.interactions);
      }
    }

    await Activity.delete({ user: { id: userId } });

    await Friend.delete({ requester_id: userId });
    await Friend.delete({ requested_id: userId });

    await User.remove(user);
    return true;
  }

  async toggleAdminStatus(userId: number): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });
    user.isAdmin = !user.isAdmin;
    return user.save();
  }
}
