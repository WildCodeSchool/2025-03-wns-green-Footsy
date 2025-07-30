import { Resolver, Query, Mutation, Arg, Int, Float } from "type-graphql";
import Activity from "../entities/Activity";
import Type from "../entities/Type";


@Resolver()
export default class ActivityResolver {
  
  @Query(() => [Activity])
  async activities(): Promise<Activity[]> {
    return await Activity.find();
  }

  
  @Query(() => Activity, { nullable: true })
  async activity(@Arg("id", () => Int) id: number): Promise<Activity | null> {
    return await Activity.findOne({ where: { id } });
  }

 
  @Mutation(() => Activity)
  async createActivity(
    @Arg("title", () => String) title: string,
    @Arg("quantity", () => Float, { nullable: true }) quantity: number,
    @Arg("date", () => String) date: string,
    @Arg("co2_equivalent", () => Float) co2_equivalent: number,
    @Arg("user_id", () => Int) user_id: number,
    @Arg("type_id", () => Int) type_id: number
  ): Promise<Activity> {
    // Check if the type exists
    const type = await Type.findOne({ where: { id: type_id } });
    if (!type) throw new Error("Activity type not found");

    const activity = Activity.create({
      title,
      quantity,
      date,
      co2_equivalent,
      user_id,
      type_id,
    });
    return await activity.save();
  }

 
  @Mutation(() => Activity, { nullable: true })
  async updateActivity(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title?: string,
    @Arg("quantity", () => Float, { nullable: true }) quantity?: number,
    @Arg("date", () => String, { nullable: true }) date?: string,
    @Arg("co2_equivalent", () => Float, { nullable: true }) co2_equivalent?: number,
    @Arg("user_id", () => Int, { nullable: true }) user_id?: number,
    @Arg("type_id", () => Int, { nullable: true }) type_id?: number
  ): Promise<Activity | null> {
    const activity = await Activity.findOne({ where: { id } });
    if (!activity) return null;

    if (title !== undefined) activity.title = title;
    if (quantity !== undefined) activity.quantity = quantity;
    if (date !== undefined) activity.date = date;
    if (co2_equivalent !== undefined) activity.co2_equivalent = co2_equivalent;
    
    if (user_id !== undefined) {
      activity.user_id = user_id;
    }
    
    if (type_id !== undefined) {
      const type = await Type.findOne({ where: { id: type_id } });
      if (!type) throw new Error("Type d'activité non trouvé");
      activity.type_id = type_id;
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