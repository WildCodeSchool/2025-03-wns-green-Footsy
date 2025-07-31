import { Field, InputType, Int, Resolver } from "type-graphql";
import Friend from "../entities/Friend";

@InputType()
class FriendInput {
    @Field(()=> Int)
    requester_id: number;

    @Field(()=> Int)
    requested_id: number;

    @Field(() => Boolean)
    accepted: boolean;
}

@Resolver(Friend)
export default class FriendResolver {
  }

