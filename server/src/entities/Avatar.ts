import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity()
export default class Avatar extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  title: string;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  image: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.avatar)
  users: User[];
}
