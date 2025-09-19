import {
  Arg,
  Field,
  Float,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import Activity from "../entities/Activity";
import Type from "../entities/Type";
import User from "../entities/User";

@InputType()
export class CreateActivityInput {
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
}

@InputType()
export class UpdateActivityInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  quantity?: number;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => Float, { nullable: true })
  co2_equivalent?: number;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => Int, { nullable: true })
  type_id?: number;
}

@InputType()
class ActivityFilterInput {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int, { nullable: true })
  category_id?: number;
}

@Resolver()
export default class ActivityResolver {
  @Query(() => [Activity])
  async getAllActivities(): Promise<Activity[]> {
    return await Activity.find();
  }

  @Query(() => Activity, { nullable: true })
  async getActivityById(
    @Arg("id", () => Int) id: number
  ): Promise<Activity | null> {
    return await Activity.findOne({ where: { id } });
  }

  @Query(() => [Activity])
  async getActivitiesByUserIdAndFilters(
    @Arg("data", () => ActivityFilterInput) data: ActivityFilterInput
  ): Promise<Activity[]> {
    const { user_id, category_id } = data;
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) throw new Error("User not found");

    const whereClause: {
      user: { id: number };
      type?: { category: { id: number } };
    } = { user: { id: user_id } };

    if (category_id !== undefined) {
      whereClause.type = { category: { id: category_id } };
    }

    return await Activity.find({ where: whereClause });
  }

  @Mutation(() => Activity)
  async createActivity(
    @Arg("data", () => CreateActivityInput) data: CreateActivityInput
  ): Promise<Activity> {
    const user = await User.findOne({ where: { id: data.user_id } });
    if (!user) throw new Error("User not found");

    const type = await Type.findOne({ where: { id: data.type_id } });
    if (!type) throw new Error("Type not found");

    const activity = Activity.create({
      ...data,
      user,
      type,
    });
    return await activity.save();
  }

  @Mutation(() => Activity, { nullable: true })
  async updateActivity(
    @Arg("data", () => UpdateActivityInput) data: UpdateActivityInput
  ): Promise<Activity | null> {
    const activity = await Activity.findOne({ where: { id: data.id } });
    if (!activity) return null;

    if (data.title !== undefined) {
      activity.title = data.title;
    }
    if (data.quantity !== undefined) {
      activity.quantity = data.quantity;
    }
    if (data.date !== undefined) {
      activity.date = new Date(data.date);
    }
    if (data.co2_equivalent !== undefined) {
      activity.co2_equivalent = data.co2_equivalent;
    }

    if (data.user_id !== undefined) {
      const user = await User.findOne({ where: { id: data.user_id } });
      if (!user) throw new Error("User not found");
      activity.user = user;
    }

    if (data.type_id !== undefined) {
      const type = await Type.findOne({ where: { id: data.type_id } });
      if (!type) throw new Error("Type not found");
      activity.type = type;
    }

    return await activity.save();
  }

  @Mutation(() => Boolean)
  async deleteActivity(@Arg("id", () => Int) id: number): Promise<boolean> {
    const activity = await Activity.findOne({ where: { id } });
    if (!activity) return false;

    await activity.remove();
    return true;
  }
}
