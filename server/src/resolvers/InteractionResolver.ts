import { Field, InputType, Int, Resolver } from "type-graphql";
import Interaction from "../entities/Interaction";
import Activity from "../entities/Activity";

@InputType()
export class InteractionInput {
    @Field(() => Int)
    user_id: number;

    @Field(() => Number)
    activity_id: Activity;

    @Field(() => String)
    comment: string;

    @Field(() => Date)
    comment_date: Date;
}

@Resolver(Interaction)
export default class InteractionResolver {
}
