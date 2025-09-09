var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, InputType, Int, Resolver } from "type-graphql";
import Friend from "../entities/Friend";
let FriendInput = class FriendInput {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FriendInput.prototype, "requester_id", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FriendInput.prototype, "requested_id", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], FriendInput.prototype, "accepted", void 0);
FriendInput = __decorate([
    InputType()
], FriendInput);
let FriendResolver = class FriendResolver {
};
FriendResolver = __decorate([
    Resolver(Friend)
], FriendResolver);
export default FriendResolver;
