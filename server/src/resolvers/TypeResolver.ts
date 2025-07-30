import { Resolver, Query, Arg, Int } from "type-graphql";
import { Type } from "../entities/Type";

/**
 * Resolver for the Type entity
 * Handles all GraphQL operations related to activity types
 * TODO: Connect to ADEME API for real data
 */
@Resolver()
export class TypeResolver {
  /**
   * Get all activity types
   * @returns List of all activity types (placeholder data)
   */
  @Query(() => [Type])
  async types(): Promise<Type[]> {
    // TODO: Replace with ADEME API call
    return [
      { id: 1, title: "Voiture essence", quantity_unit: "km", category_id: 1 },
      { id: 2, title: "Voiture diesel", quantity_unit: "km", category_id: 1 },
      { id: 3, title: "Transport en commun", quantity_unit: "km", category_id: 1 }
    ] as Type[];
  }

  /**
   * Get an activity type by its ID
   * @param id - Unique activity type identifier
   * @returns The corresponding type or null if not found
   */
  @Query(() => Type, { nullable: true })
  async type(@Arg("id", () => Int) id: number): Promise<Type | null> {
    // TODO: Replace with ADEME API call
    const types = [
      { id: 1, title: "Voiture essence", quantity_unit: "km", category_id: 1 },
      { id: 2, title: "Voiture diesel", quantity_unit: "km", category_id: 1 },
      { id: 3, title: "Transport en commun", quantity_unit: "km", category_id: 1 }
    ] as Type[];
    
    return types.find(type => type.id === id) || null;
  }

  // TODO: Add mutations when needed for admin purposes ?
}
