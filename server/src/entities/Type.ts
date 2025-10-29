import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Activity from "./Activity";
import Category from "./Category";

@ObjectType()
@Entity()
export default class Type extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  title: string;

  @Field(() => String)
  @Column("varchar", { length: 10 })
  quantity_unit: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.types)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Field(() => Int)
  @Column("number")
  category_id: number;

  @Field(() => [Activity])
  @OneToMany(() => Activity, (activity) => activity.type)
  activities: Activity[];
}
