import { Resolver, Query, Mutation, Arg, Int, Float, InputType, Field } from "type-graphql";
import Activity from "../entities/Activity";
import Type from "../entities/Type";
import User from "../entities/User";
import { InteractionInput } from "./InteractionResolver";

@InputType()
export class ActivityInput {
    @Field(() => Int)
      id: number;
    
      @Field(() => String)
      title: string;
    
      @Field(() => Float, { nullable: true })
      quantity: number;
    
      @Field(() => Date)
      date: Date;
    
      @Field(() => Float)
      co2_equivalent: number;
    
      @Field(() => Int)
      user_id: number;
    
      @Field(() => Int)
      type_id: number;
    
      @Field(() => InteractionInput)
      interactions: InteractionInput[];
}

@Resolver()
export default class ActivityResolver {
  @Query(() => [Activity])
  async activities(): Promise<Activity[]> {
    return await Activity.find();
  }

  @Query(() => [Activity])
  async activitiesByUserId(@Arg("userId", () => Int) userId: number): Promise<Activity[]> {
    return await Activity.find({ where: { user: { id: userId } } });
  }

  @Mutation(() => Activity)
  async createActivity(@Arg("data", () => ActivityInput) data: ActivityInput): Promise<Activity> {
    const user = await User.findOneByOrFail({ id: data.user_id });
    const type = await Type.findOneByOrFail({ id: data.type_id });

    const activity = Activity.create({
      ...data,
      user,
      type,
    });
    return await activity.save();
  }

  @Mutation(() => Activity, { nullable: true })
  async updateActivity(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => ActivityInput) data: Partial<ActivityInput>
  ): Promise<Activity | null> {
    const activity = await Activity.findOne({ where: { id } });
    if (!activity) return null;

    Object.assign(activity, data);
    return await activity.save();
  }

  @Mutation(() => Boolean)
  async deleteActivity(@Arg("id", () => Int) id: number): Promise<boolean> {
    const result = await Activity.delete(id);
    return result.affected !== 0;
  }
}