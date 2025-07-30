import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import Category from "../entities/Category";

/**
 * TODO: Connect to ADEME API for real data
 */
@Resolver()
export default class CategoryResolver {
  
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    // TODO: Replace with ADEME API call
    return [
      { id: 1, title: "Transport" },
      { id: 2, title: "Alimentation" },
      { id: 3, title: "Énergie" }
    ] as Category[];
  }

  
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