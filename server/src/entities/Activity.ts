import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Field, Int, ObjectType, Float } from "type-graphql";
import Type from "./Type";
import Interaction from "./Interaction";


@ObjectType()
@Entity()
export default class Activity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  title: string;

  
  @Field(() => Float, { nullable: true })
  @Column("float", { nullable: true })
  quantity: number;

  
  @Field(() => String)
  @Column("date")
  date: string;

  @Field(() => Float)
  @Column("float")
  co2_equivalent: number;

  @Field(() => Int)
  @Column("int")
  user_id: number;

  @Field(() => Int)
  @Column("int")
  type_id: number;

  @ManyToOne(() => Type, type => type.activities)
  @JoinColumn({ name: "type_id" })
  type: Type;

  @Field(() => Interaction)
  @ManyToOne(() => Interaction, (interaction) => interaction.activities)
  interaction: Interaction;
} 