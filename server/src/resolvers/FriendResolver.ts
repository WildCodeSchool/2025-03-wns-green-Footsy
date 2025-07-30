import { Field, InputType, Resolver } from "type-graphql";
import Friend from "../entities/Friend";

@InputType()
class FriendInput {
    @Field(()=> Number)
    requester: number;

    @Field(()=> Number)
    requested: number;

    @Field(() => Boolean)
    accepted: boolean;

}

@Resolver(Friend)
export default class FriendResolver {
  }

