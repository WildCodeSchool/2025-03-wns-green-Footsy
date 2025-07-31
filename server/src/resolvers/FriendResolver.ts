import { Field, InputType, Int, Resolver } from "type-graphql";
import Friend from "../entities/Friend";

@InputType()
class FriendInput {
    @Field(()=> Int)
    requester: number;

    @Field(()=> Number)
    requested: number;

    @Field(() => Boolean)
    accepted: boolean;

}

@Resolver(Friend)
export default class FriendResolver {
  }

