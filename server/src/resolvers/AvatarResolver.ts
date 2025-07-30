import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Avatar } from "../entities/Avatar";

@InputType()
class AvatarInput {  
    @Field()
    title: string;
  
    @Field()
    image: string;
}

@Resolver(Avatar)
export class AvatarResolver {
  @Query(() => [Avatar])
  async getAllAvatar() {
    return Avatar.find();
  }

  @Query(() => [Avatar])
  async getAvatar(@Arg("id") id: number) {
    const avatar = await Avatar.findOneByOrFail({id});
    return avatar;
  }
}