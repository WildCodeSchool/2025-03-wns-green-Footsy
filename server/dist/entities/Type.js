var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import Activity from "./Activity";
import Category from "./Category";
let Type = class Type extends BaseEntity {
};
__decorate([
    Field(() => Int),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Type.prototype, "id", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 50 }),
    __metadata("design:type", String)
], Type.prototype, "title", void 0);
__decorate([
    Field(() => String),
    Column("varchar", { length: 10 }),
    __metadata("design:type", String)
], Type.prototype, "quantity_unit", void 0);
__decorate([
    Field(() => Category),
    ManyToOne(() => Category, category => category.types),
    JoinColumn({ name: "category_id" }),
    __metadata("design:type", Array)
], Type.prototype, "categories", void 0);
__decorate([
    Field(() => Activity),
    OneToMany(() => Activity, (activity) => activity.type),
    __metadata("design:type", Array)
], Type.prototype, "activities", void 0);
Type = __decorate([
    ObjectType(),
    Entity()
], Type);
export default Type;
