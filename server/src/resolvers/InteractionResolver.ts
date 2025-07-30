import { Field, InputType, Resolver } from "type-graphql";
import Interaction from "../entities/Interaction";

@InputType()
export class InteractionInput {
    @Field(() => Number)
    user: number;

    @Field(() => Number)
    activity: number;

    @Field(() => String)
    comment: string;

    @Field(() => Date)
    comment_date: Date;
}

@Resolver(Interaction)
export default class InteractionResolver {
}
