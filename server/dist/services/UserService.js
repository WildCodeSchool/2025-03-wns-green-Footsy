import * as argon2 from "argon2";
import User from "../entities/User";
export default class UserService {
    async create(data) {
        const user = User.create({ ...data, hashed_password: data.password });
        return user.save();
    }
    async findByEmail(email) {
        return User.findOne({
            where: { email },
            relations: ["avatar"]
        });
    }
    async authenticateUser(email, password) {
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
}
