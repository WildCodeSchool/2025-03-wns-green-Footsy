import * as argon2 from "argon2";
import User from "../entities/User";


import type { NewUserInput } from "../resolvers/UserResolver";

export interface UserServiceInterface {
  create(data: NewUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailAndPassword(email: string, password: string): Promise<User | null>;
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

  async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
  
    const isPasswordValid = await argon2.verify(user.hashed_password, password);
    if (!isPasswordValid) return null;

    return user;
  }
}
