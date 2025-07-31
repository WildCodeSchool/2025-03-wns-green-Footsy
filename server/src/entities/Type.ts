import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
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
  @Column("varchar")
  title: string;


  @Field(() => String)
  @Column("varchar")
  quantity_unit: string;

  @Field(() => Category)
  @ManyToOne(() => Category, category => category.types)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Field(() => Activity)
  @OneToMany(() => Activity, activity => activity.type)
  activities: Activity[];
}
