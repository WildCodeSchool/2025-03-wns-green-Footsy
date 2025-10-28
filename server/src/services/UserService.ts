import * as argon2 from "argon2";
import User from "../entities/User";

import type { NewUserInput, UpdatePersonalInfoInput } from "../resolvers/UserResolver";

export interface UserServiceInterface {
  create(data: NewUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  authenticateUser(email: string, password: string): Promise<User>;
  updatePersonalInfo(userId: number, data: UpdatePersonalInfoInput): Promise<User>;
}

export default class UserService implements UserServiceInterface {
  async create(data: NewUserInput): Promise<User> {
    const user = User.create({ ...data, hashed_password: data.password });
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
    user.birthdate = new Date(data.birthdate as string);
    
    return user.save();
  }
  
}
