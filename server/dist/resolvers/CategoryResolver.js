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
import Category from "../entities/Category";
/**
 * TODO: Connect to ADEME API for real data
 */
let CategoryResolver = class CategoryResolver {
    async categories() {
        // TODO: Replace with ADEME API call
        return [
            { id: 1, title: "Transport" },
            { id: 2, title: "Alimentation" },
            { id: 3, title: "Énergie" }
        ];
    }
    async category(id) {
        // TODO: Replace with ADEME API call
        const categories = [
            { id: 1, title: "Transport" },
            { id: 2, title: "Alimentation" },
            { id: 3, title: "Énergie" }
        ];
        return categories.find(cat => cat.id === id) || null;
    }
};
__decorate([
    Query(() => [Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    Query(() => Category, { nullable: true }),
    __param(0, Arg("id", () => Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
CategoryResolver = __decorate([
    Resolver()
], CategoryResolver);
export default CategoryResolver;
