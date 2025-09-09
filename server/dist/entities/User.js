var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import Avatar from "./Avatar";
import Friend from "./Friend";
import Interaction from "./Interaction";
import Activity from "./Activity";
let User = class User extends BaseEntity {
};
__decorate([
    Field(() => Int),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 50 }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 50 }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    Field(() => String),
    Column({ type: "varchar", unique: true, length: 50 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column("varchar", { length: 255 }),
    __metadata("design:type", String)
], User.prototype, "hashed_password", void 0);
__decorate([
    Field(() => Date),
    Column("date"),
    __metadata("design:type", Date)
], User.prototype, "birthdate", void 0);
__decorate([
    Field(() => Avatar),
    ManyToOne(() => Avatar, (avatar) => avatar.users, { nullable: false }),
    JoinColumn({ name: "avatar_id" }),
    __metadata("design:type", Avatar)
], User.prototype, "avatar", void 0);
__decorate([
    OneToMany(() => Friend, friend => friend.requester),
    __metadata("design:type", Array)
], User.prototype, "sentFriendRequests", void 0);
__decorate([
    OneToMany(() => Friend, friend => friend.requested),
    __metadata("design:type", Array)
], User.prototype, "receivedFriendRequests", void 0);
__decorate([
    Field(() => Interaction),
    OneToMany(() => Interaction, interaction => interaction.users),
    __metadata("design:type", Array)
], User.prototype, "interactions", void 0);
__decorate([
    Field(() => [Activity]),
    OneToMany(() => Activity, (activity) => activity.user),
    __metadata("design:type", Array)
], User.prototype, "activities", void 0);
User = __decorate([
    ObjectType(),
    Entity()
], User);
export default User;
