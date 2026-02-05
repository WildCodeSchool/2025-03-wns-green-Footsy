import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
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

  @Field(() => String)
  @Column("varchar", { length: 10 })
  quantity_unit: string;

  @Field(() => Int, { nullable: true })
  @Column("int", { nullable: true, unique: true })
  ademe_id?: number;

  @Field(() => [Type])
  @OneToMany(() => Type, (type) => type.category)
  types: Type[];
}
