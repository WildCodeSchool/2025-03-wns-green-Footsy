var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import User from "./User";
let Avatar = class Avatar extends BaseEntity {
};
__decorate([
    Field(() => Int),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Avatar.prototype, "id", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 50 }),
    __metadata("design:type", String)
], Avatar.prototype, "title", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 50 }),
    __metadata("design:type", String)
], Avatar.prototype, "image", void 0);
__decorate([
    Field(() => [User]),
    OneToMany(() => User, (user) => user.avatar),
    __metadata("design:type", Array)
], Avatar.prototype, "users", void 0);
Avatar = __decorate([
    ObjectType(),
    Entity()
], Avatar);
export default Avatar;
