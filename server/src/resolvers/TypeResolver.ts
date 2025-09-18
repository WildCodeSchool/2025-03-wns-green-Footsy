import { Arg, Int, Query, Resolver } from "type-graphql";
import Type from "../entities/Type";

@Resolver()
export default class TypeResolver {
  @Query(() => [Type])
  async getAllTypes(): Promise<Type[]> {
    // TODO: Replace with ADEME API call > NO that would be too muck API calls. We just need to seed the DB once
    return [
      { id: 1, title: "Voiture essence", quantity_unit: "km", category_id: 1 },
      { id: 2, title: "Voiture diesel", quantity_unit: "km", category_id: 1 },
      {
        id: 3,
        title: "Transport en commun",
        quantity_unit: "km",
        category_id: 1,
      },
    ] as Type[];
  }

  @Query(() => Type, { nullable: true })
  async type(@Arg("id", () => Int) id: number): Promise<Type | null> {
    // TODO: Replace with ADEME API call > NO that would be too muck API calls. We just need to seed the DB once
    const types = [
      { id: 1, title: "Voiture essence", quantity_unit: "km", category_id: 1 },
      { id: 2, title: "Voiture diesel", quantity_unit: "km", category_id: 1 },
      {
        id: 3,
        title: "Transport en commun",
        quantity_unit: "km",
        category_id: 1,
      },
    ] as Type[];

    return types.find((type) => type.id === id) || null;
  }

  // TODO: Add mutations when needed for admin purposes ?
}
