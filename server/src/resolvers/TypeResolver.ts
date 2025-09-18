import { Arg, Int, Query, Resolver } from "type-graphql";
import Type from "../entities/Type";

@Resolver()
export default class TypeResolver {
  @Query(() => [Type])
  async getAllTypes(): Promise<Type[]> {
    return await Type.find();
  }

  @Query(() => [Type])
  async getTypesByCategoryId(
    @Arg("categoryId", () => Int) categoryId: number
  ): Promise<Type[]> {
    return await Type.find({ where: { category_id: categoryId } });
  }

  @Query(() => Type, { nullable: true })
  async getTypeById(@Arg("id", () => Int) id: number): Promise<Type | null> {
    return await Type.findOne({ where: { id } });
  }
}
