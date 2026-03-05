import { Field, InputType, Int, Resolver } from "type-graphql";
import Interaction from "../entities/Interaction";

@InputType()
export class InteractionInput {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  activity_id: number;

  @Field(() => String)
  comment: string;

  @Field(() => Date)
  comment_date: Date;
}

@Resolver(Interaction)
export default class InteractionResolver {}
