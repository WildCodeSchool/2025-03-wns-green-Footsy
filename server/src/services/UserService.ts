import * as argon2 from "argon2";
import User from "../entities/User";
import Avatar from "../entities/Avatar";

import type { NewUserInput, UpdatePersonalInfoInput } from "../resolvers/UserResolver";

// Password must be at least 8 characters, include upper and lower case letters,
// at least one digit and one special character.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function validatePassword(password: string) {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, a number and a special character"
    );
  }
}

export interface UserServiceInterface {
  create(data: NewUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  authenticateUser(email: string, password: string): Promise<User>;
  updatePersonalInfo(userId: number, data: UpdatePersonalInfoInput): Promise<User>;
  updateAvatar(userId: number, avatarId: number): Promise<User>;
  changePassword(userId: number, currentPassword: string, newPassword: string): Promise<User>;
  deleteAccount(userId: number): Promise<boolean>;
}

export default class UserService implements UserServiceInterface {
  async create(data: NewUserInput): Promise<User> {
    // Validate password strength before hashing
    validatePassword(data.password);

    const hashed = await argon2.hash(data.password);
    const user = User.create({ ...data, hashed_password: hashed });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
      relations: ["avatar"]
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

  async updatePersonalInfo(userId: number, data: UpdatePersonalInfoInput): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });
    
    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.birthdate = new Date(data.birthdate);
    
    return user.save();
  }

  async updateAvatar(userId: number, avatarId: number): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });
    const avatar = await Avatar.findOneByOrFail({ id: avatarId });
    
    user.avatar = avatar;
    return user.save();
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<User> {
    const user = await User.findOneByOrFail({ id: userId });
    
    const isValidCurrentPassword = await argon2.verify(user.hashed_password, currentPassword);
    if (!isValidCurrentPassword) {
      throw new Error("Current password is incorrect");
    }
    // Validate the new password
    validatePassword(newPassword);

    const hashedNewPassword = await argon2.hash(newPassword);

    user.hashed_password = hashedNewPassword;
    
    return user.save();
  }

  async deleteAccount(userId: number): Promise<boolean> {
    const user = await User.findOneByOrFail({ id: userId });
    await User.remove(user);
    return true;
  }
  
}