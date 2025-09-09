var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { AvatarInput } from "./AvatarResolver";
import User from "../entities/User";
import UserService from "../services/UserService";
let NewUserInput = class NewUserInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], NewUserInput.prototype, "first_name", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], NewUserInput.prototype, "last_name", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], NewUserInput.prototype, "email", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], NewUserInput.prototype, "password", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], NewUserInput.prototype, "birthdate", void 0);
__decorate([
    Field(() => AvatarInput),
    __metadata("design:type", AvatarInput)
], NewUserInput.prototype, "avatar", void 0);
NewUserInput = __decorate([
    InputType()
], NewUserInput);
export { NewUserInput };
function getUserPublicProfile(user) {
    return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        mail: user.email,
        birthDate: user.birthdate,
        avatar: user.avatar,
    };
}
function getUserTokenContent(user) {
    return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        mail: user.email,
        birthDate: user.birthdate,
        avatar: user.avatar,
    };
}
let UserInput = class UserInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], UserInput.prototype, "email", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], UserInput.prototype, "password", void 0);
UserInput = __decorate([
    InputType()
], UserInput);
export { UserInput };
let LoginResponse = class LoginResponse {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], LoginResponse.prototype, "token", void 0);
__decorate([
    Field(() => User),
    __metadata("design:type", User)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    InputType()
], LoginResponse);
export { LoginResponse };
let UserResolver = class UserResolver {
    constructor(userService = new UserService()) {
        this.userService = userService;
    }
    async getAllUsers() {
        return User.find();
    }
    async getUser(id) {
        const user = await User.findOneByOrFail({ id });
        return user;
    }
    async signup(userData) {
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
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }
    async login(userData) {
        try {
            if (!process.env.JWT_SECRET)
                throw new Error("Missing env variable: JWT_SECRET");
            const user = await this.userService.authenticateUser(userData.email, userData.password);
            if (!user) {
                throw new Error("Incorrect email or password");
            }
            const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);
            return `${JSON.stringify(getUserPublicProfile(user))}; token=${token}`;
        }
        catch (err) {
            console.error(err);
            throw new Error("Login error");
        }
    }
};
__decorate([
    Query(() => [User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllUsers", null);
__decorate([
    Query(() => User),
    __param(0, Arg("id", () => Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    Mutation(() => String),
    __param(0, Arg("data", () => NewUserInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signup", null);
__decorate([
    Mutation(() => String),
    __param(0, Arg("data", () => UserInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    Resolver(User),
    __metadata("design:paramtypes", [Object])
], UserResolver);
export default UserResolver;
