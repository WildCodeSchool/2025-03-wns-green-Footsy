import { Arg, Int, Query, Resolver } from "type-graphql";
import Category from "../entities/Category";

@Resolver()
export default class CategoryResolver {
  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    // TODO: Replace with ADEME API call > NO that would be too muck API calls. We just need to seed the DB once
    return [
      { id: 1, title: "Transport" },
      { id: 2, title: "Alimentation" },
      { id: 3, title: "Énergie" },
    ] as Category[];
  }

  @Query(() => Category, { nullable: true })
  async getCategoryById(
    @Arg("id", () => Int) id: number
  ): Promise<Category | null> {
    // TODO: Replace with ADEME API call > NO that would be too muck API calls. We just need to seed the DB once
    const categories = [
      { id: 1, title: "Transport" },
      { id: 2, title: "Alimentation" },
      { id: 3, title: "Énergie" },
    ] as Category[];

    return categories.find((cat) => cat.id === id) || null;
  }
}
