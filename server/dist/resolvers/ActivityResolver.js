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
import { Resolver, Query, Mutation, Arg, Int, Float, InputType, Field } from "type-graphql";
import Activity from "../entities/Activity";
import Type from "../entities/Type";
import User from "../entities/User";
import { InteractionInput } from "./InteractionResolver";
let ActivityInput = class ActivityInput {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ActivityInput.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ActivityInput.prototype, "title", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    __metadata("design:type", Number)
], ActivityInput.prototype, "quantity", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], ActivityInput.prototype, "date", void 0);
__decorate([
    Field(() => Float),
    __metadata("design:type", Number)
], ActivityInput.prototype, "co2_equivalent", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ActivityInput.prototype, "user_id", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ActivityInput.prototype, "type_id", void 0);
__decorate([
    Field(() => InteractionInput),
    __metadata("design:type", Array)
], ActivityInput.prototype, "interactions", void 0);
ActivityInput = __decorate([
    InputType()
], ActivityInput);
export { ActivityInput };
let ActivityResolver = class ActivityResolver {
    async activities() {
        return await Activity.find();
    }
    async activity(id) {
        return await Activity.findOne({ where: { id } });
    }
    async createActivity(data) {
        const user = await User.findOne({ where: { id: data.user_id } });
        if (!user)
            throw new Error("User not found");
        const type = await Type.findOne({ where: { id: data.type_id } });
        if (!type)
            throw new Error("Type not found");
        const activity = Activity.create({
            ...data,
            user,
            type,
        });
        return await activity.save();
    }
    async updateActivity(data) {
        const activity = await Activity.findOne({ where: { id: data.id } });
        if (!activity)
            return null;
        if (data.title !== undefined) {
            activity.title = data.title;
        }
        ;
        if (data.quantity !== undefined) {
            activity.quantity = data.quantity;
        }
        ;
        if (data.date !== undefined) {
            activity.date = new Date(data.date);
        }
        ;
        if (data.co2_equivalent !== undefined) {
            activity.co2_equivalent = data.co2_equivalent;
        }
        ;
        if (data.user_id !== undefined) {
            const user = await User.findOne({ where: { id: data.user_id } });
            if (!user)
                throw new Error("User not found");
            activity.user = user;
        }
        if (data.type_id !== undefined) {
            const type = await Type.findOne({ where: { id: data.type_id } });
            if (!type)
                throw new Error("Type not found");
            activity.type = type;
        }
        return await activity.save();
    }
    async deleteActivity(id) {
        const activity = await Activity.findOne({ where: { id } });
        if (!activity)
            return false;
        await activity.remove();
        return true;
    }
};
__decorate([
    Query(() => [Activity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "activities", null);
__decorate([
    Query(() => Activity, { nullable: true }),
    __param(0, Arg("id", () => Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "activity", null);
__decorate([
    Mutation(() => Activity),
    __param(0, Arg("data", () => ActivityInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ActivityInput]),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "createActivity", null);
__decorate([
    Mutation(() => Activity, { nullable: true }),
    __param(0, Arg("data", () => ActivityInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ActivityInput]),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "updateActivity", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, Arg("id", () => Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityResolver.prototype, "deleteActivity", null);
ActivityResolver = __decorate([
    Resolver()
], ActivityResolver);
export default ActivityResolver;
