import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
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
  @OneToOne(() => Category, category => category.types)
  @JoinColumn({ name: "category_id" })
  categories: Category[];

  @Field(() => Activity)
  @OneToMany(() => Activity, (activity) => activity.type)
  activities: Activity[];
}
