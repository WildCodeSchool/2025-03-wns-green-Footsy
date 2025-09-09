var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import User from "./User";
let Friend = class Friend extends BaseEntity {
};
__decorate([
    Field(() => Int),
    PrimaryColumn({ type: "int" }),
    __metadata("design:type", Number)
], Friend.prototype, "requester_id", void 0);
__decorate([
    Field(() => Int),
    PrimaryColumn({ type: "int" }),
    __metadata("design:type", Number)
], Friend.prototype, "requested_id", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.sentFriendRequests, { eager: true }),
    __metadata("design:type", User)
], Friend.prototype, "requester", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.receivedFriendRequests, { eager: true }),
    __metadata("design:type", User)
], Friend.prototype, "requested", void 0);
__decorate([
    Field(() => Boolean),
    Column({ type: "boolean", default: "false" }),
    __metadata("design:type", Boolean)
], Friend.prototype, "accepted", void 0);
Friend = __decorate([
    ObjectType(),
    Unique(["requester_id", "requested_id"]),
    Entity()
], Friend);
export default Friend;
