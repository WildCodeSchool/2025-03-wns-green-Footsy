var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Field, Int, ObjectType, Float } from "type-graphql";
import Type from "./Type";
import Interaction from "./Interaction";
import User from "./User";
let Activity = class Activity extends BaseEntity {
};
__decorate([
    Field(() => Int),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Activity.prototype, "id", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 50 }),
    __metadata("design:type", String)
], Activity.prototype, "title", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Column("float", { nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "quantity", void 0);
__decorate([
    Field(() => Date),
    Column("date"),
    __metadata("design:type", Date)
], Activity.prototype, "date", void 0);
__decorate([
    Field(() => Float),
    Column("float"),
    __metadata("design:type", Number)
], Activity.prototype, "co2_equivalent", void 0);
__decorate([
    Field(() => User),
    ManyToOne(() => User, user => user.activities, { nullable: false }),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", User)
], Activity.prototype, "user", void 0);
__decorate([
    Field(() => Type),
    ManyToOne(() => Type, type => type.activities, { nullable: false }),
    JoinColumn({ name: "type_id" }),
    __metadata("design:type", Type)
], Activity.prototype, "type", void 0);
__decorate([
    Field(() => Interaction),
    OneToMany(() => Interaction, interaction => interaction.activity),
    __metadata("design:type", Array)
], Activity.prototype, "interactions", void 0);
Activity = __decorate([
    ObjectType(),
    Entity()
], Activity);
export default Activity;
