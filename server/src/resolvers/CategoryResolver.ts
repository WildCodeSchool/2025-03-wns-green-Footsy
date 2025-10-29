import { Arg, Int, Query, Resolver } from "type-graphql";
import Category from "../entities/Category";

@Resolver()
export default class CategoryResolver {
  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    return await Category.find();
  }

  @Query(() => Category, { nullable: true })
  async getCategoryById(
    @Arg("id", () => Int) id: number
  ): Promise<Category | null> {
    return await Category.findOne({ where: { id } });
  }
}
