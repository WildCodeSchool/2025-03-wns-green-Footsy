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
import { Between } from "typeorm";

import Activity from "../entities/Activity";
import Type from "../entities/Type";
import User from "../entities/User";
import {
  CreateActivityInputSchema,
  UpdateActivityInputSchema,
} from "../schemas/activity.schema";

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
  async findActivitiesByUserIdAndYear(
    userId: number,
    year: number,
  ): Promise<Activity[]> {
    // Use real Date objects for TypeORM date comparisons.
    // Column type is "date" (no time), so local midnight boundaries are fine.
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    return await Activity.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      relations: ["type", "type.category"],
      order: { date: "ASC" },
    });
  }

  @Query(() => [Activity])
  async getActivitiesByUserIdAndYear(
    @Arg("userId", () => Int) userId: number,
    @Arg("year", () => Int) year: number,
  ): Promise<Activity[]> {
    return await this.findActivitiesByUserIdAndYear(userId, year);
  }

  async findActivitiesByUserIdAndCategory(
    userId: number,
    categoryId: number,
  ): Promise<Activity[]> {
    return await Activity.find({
      where: {
        user: { id: userId },
        type: { category: { id: categoryId } },
      },
      relations: ["type", "type.category"],
      order: { date: "ASC" },
    });
  }

  @Query(() => [Activity])
  async getActivitiesByUserIdAndCategory(
    @Arg("userId", () => Int) userId: number,
    @Arg("categoryId", () => Int) categoryId: number,
  ): Promise<Activity[]> {
    return await this.findActivitiesByUserIdAndCategory(userId, categoryId);
  }
  @Query(() => [Activity])
  async getAllActivities(): Promise<Activity[]> {
    return await Activity.find();
  }

  @Query(() => Activity, { nullable: true })
  async getActivityById(
    @Arg("id", () => Int) id: number,
  ): Promise<Activity | null> {
    return await Activity.findOne({ where: { id } });
  }
  @Query(() => [Activity])
  async getActivitiesByUserId(
    @Arg("userId", () => Int) userId: number,
  ): Promise<Activity[]> {
    return await Activity.find({
      where: { user: { id: userId } },
      relations: ["type", "type.category"],
    });
  }

  @Query(() => [Activity])
  async getActivitiesByUserIdAndFilters(
    @Arg("data", () => ActivityFilterInput) data: ActivityFilterInput,
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

    return await Activity.find({
      where: whereClause,
      relations: ["type", "type.category"],
    });
  }

  @Mutation(() => Activity)
  async createActivity(
    @Arg("data", () => CreateActivityInput) data: CreateActivityInput,
  ): Promise<Activity> {
    // Validate input with Zod
    const parsed = CreateActivityInputSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || "Invalid input");
    }

    const user = await User.findOne({ where: { id: parsed.data.user_id } });
    if (!user) throw new Error("User not found");

    const type = await Type.findOne({ where: { id: parsed.data.type_id } });
    if (!type) throw new Error("Type not found");

    const activity = Activity.create({
      ...parsed.data,
      date:
        parsed.data.date instanceof Date
          ? parsed.data.date
          : new Date(parsed.data.date as string),
      user,
      type,
    });
    return await activity.save();
  }

  @Mutation(() => Activity, { nullable: true })
  async updateActivity(
    @Arg("data", () => UpdateActivityInput) data: UpdateActivityInput,
  ): Promise<Activity | null> {
    // Validate input with Zod
    const parsed = UpdateActivityInputSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || "Invalid input");
    }

    const activity = await Activity.findOne({ where: { id: parsed.data.id } });
    if (!activity) return null;

    if (parsed.data.title !== undefined) {
      activity.title = parsed.data.title;
    }
    if (parsed.data.quantity !== undefined) {
      activity.quantity = parsed.data.quantity;
    }
    if (parsed.data.date !== undefined) {
      activity.date =
        parsed.data.date instanceof Date
          ? parsed.data.date
          : new Date(parsed.data.date as string);
    }
    if (parsed.data.co2_equivalent !== undefined) {
      activity.co2_equivalent = parsed.data.co2_equivalent;
    }

    if (parsed.data.user_id !== undefined) {
      const user = await User.findOne({ where: { id: parsed.data.user_id } });
      if (!user) throw new Error("User not found");
      activity.user = user;
    }

    if (parsed.data.type_id !== undefined) {
      const type = await Type.findOne({ where: { id: parsed.data.type_id } });
      if (!type) throw new Error("Type not found");
      activity.type = type;
    }

    return await activity.save();
  }

  @Mutation(() => Boolean)
  async deleteActivity(@Arg("id", () => Int) id: number): Promise<boolean> {
    const result = await Activity.delete(id);
    return result.affected !== 0;
  }
}
