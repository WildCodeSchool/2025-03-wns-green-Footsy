import { User } from "../entities/User";

import type { NewUserInput } from "../resolvers/UserResolver";

export interface UserServiceInterface {
	create(data: NewUserInput): Promise<User>;
}

export default class UserService implements UserServiceInterface {
	async create(data: NewUserInput): Promise<User> {
		const user = User.create({ ...data, hashedPassword: data.password });
		return user.save();
	}
}
