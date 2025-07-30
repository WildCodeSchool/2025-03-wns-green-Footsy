import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Avatar extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar")
  title: string;

  @Field()
  @Column("varchar")
  image: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.avatar_id)
  users: User[];
}
