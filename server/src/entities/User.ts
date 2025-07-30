import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Avatar from "./Avatar";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar")
  first_name: string;

  @Field(() => String)
  @Column("varchar")
  last_name: string;

  @Field(() => String)
  @Column("varchar")
  email: string;

  @Field(() => String)
  @Column("varchar")
  hashed_password: string;

  @Field(() => Date)
  @Column("varchar")
  birthdate: Date;

  @Field(() => Avatar)
  @ManyToOne(() => Avatar, (avatar) => avatar.users)
  avatar: Avatar;
}
