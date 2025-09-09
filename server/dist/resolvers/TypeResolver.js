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
import { Resolver, Query, Arg, Int } from "type-graphql";
import Type from "../entities/Type";
/**
 * TODO: Connect to ADEME API for real data
 */
let TypeResolver = class TypeResolver {
    async types() {
        // TODO: Replace with ADEME API call
        return [
            { id: 1, title: "Voiture essence", quantity_unit: "km", category_id: 1 },
            { id: 2, title: "Voiture diesel", quantity_unit: "km", category_id: 1 },
            { id: 3, title: "Transport en commun", quantity_unit: "km", category_id: 1 }
        ];
    }
    async type(id) {
        // TODO: Replace with ADEME API call
        const types = [
            { id: 1, title: "Voiture essence", quantity_unit: "km", category_id: 1 },
            { id: 2, title: "Voiture diesel", quantity_unit: "km", category_id: 1 },
            { id: 3, title: "Transport en commun", quantity_unit: "km", category_id: 1 }
        ];
        return types.find(type => type.id === id) || null;
    }
};
__decorate([
    Query(() => [Type]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TypeResolver.prototype, "types", null);
__decorate([
    Query(() => Type, { nullable: true }),
    __param(0, Arg("id", () => Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TypeResolver.prototype, "type", null);
TypeResolver = __decorate([
    Resolver()
], TypeResolver);
export default TypeResolver;
