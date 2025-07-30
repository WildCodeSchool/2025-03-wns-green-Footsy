import { Arg, Field, InputType, Query, Resolver } from "type-graphql";
import Avatar from "../entities/Avatar";

@InputType()
export class AvatarInput {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  image: string;
}

@Resolver(Avatar)
export default class AvatarResolver {
  @Query(() => [Avatar])
  async getAllAvatars() {
    return Avatar.find();
  }
  @Query(() => [Avatar])
  async getAvatar(@Arg("id", () => Number) id: number) {
    const avatar = await Avatar.findOneByOrFail({ id });
    return avatar;
  }
}