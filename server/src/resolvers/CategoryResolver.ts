import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Category } from "../entities/Category";

/**
 * Resolver for the Category entity
 * Handles all GraphQL operations related to categories
 * TODO: Connect to ADEME API for real data
 */
@Resolver()
export class CategoryResolver {
  /**
   * Get all categories
   * @returns List of all categories (placeholder data)
   */
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    // TODO: Replace with ADEME API call
    return [
      { id: 1, title: "Transport" },
      { id: 2, title: "Alimentation" },
      { id: 3, title: "Énergie" }
    ] as Category[];
  }

  /**
   * Get a category by its ID
   * @param id - Unique category identifier
   * @returns The corresponding category or null if not found
   */
  @Query(() => Category, { nullable: true })
  async category(@Arg("id", () => Int) id: number): Promise<Category | null> {
    // TODO: Replace with ADEME API call
    const categories = [
      { id: 1, title: "Transport" },
      { id: 2, title: "Alimentation" },
      { id: 3, title: "Énergie" }
    ] as Category[];
    
    return categories.find(cat => cat.id === id) || null;
  }
} 