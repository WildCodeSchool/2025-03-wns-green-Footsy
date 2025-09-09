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
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import User from "./User";
import Activity from "./Activity";
let Interaction = class Interaction extends BaseEntity {
};
__decorate([
    Field(() => Int),
    PrimaryColumn({ type: "int" }),
    __metadata("design:type", Number)
], Interaction.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, user => user.interactions, { nullable: false }),
    __metadata("design:type", Array)
], Interaction.prototype, "users", void 0);
__decorate([
    Field(() => Int),
    PrimaryColumn({ type: "int" }),
    __metadata("design:type", Number)
], Interaction.prototype, "activity_id", void 0);
__decorate([
    ManyToOne(() => Activity, activity => activity.interactions, { nullable: false }),
    __metadata("design:type", Array)
], Interaction.prototype, "activity", void 0);
__decorate([
    Field(() => String),
    Column("text"),
    __metadata("design:type", String)
], Interaction.prototype, "comment", void 0);
__decorate([
    Field(() => Date),
    Column("date"),
    __metadata("design:type", Date)
], Interaction.prototype, "comment_date", void 0);
Interaction = __decorate([
    ObjectType(),
    Unique(["user_id", "activity_id"]),
    Entity()
], Interaction);
export default Interaction;
