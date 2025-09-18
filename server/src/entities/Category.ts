import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Type from "./Type";

@ObjectType()
@Entity()
export default class Category extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  title: string;

  @Field(() => Type)
  @ManyToOne(() => Type, (type) => type.categories, { nullable: true })
  types: Type[];
}
