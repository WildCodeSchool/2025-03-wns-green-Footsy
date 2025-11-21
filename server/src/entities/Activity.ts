import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Interaction from "./Interaction";
import Type from "./Type";
import User from "./User";

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

  @Field(() => Date)
  @Column({
    type: "date",
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => (value ? new Date(value) : null),
    },
  })
  date: Date;

  @Field(() => Float)
  @Column("float")
  co2_equivalent: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.activities, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field(() => Type)
  @ManyToOne(() => Type, (type) => type.activities, { nullable: false })
  @JoinColumn({ name: "type_id" })
  type: Type;

  @Field(() => Interaction)
  @OneToMany(() => Interaction, (interaction) => interaction.activity, {
    nullable: true,
  })
  interactions: Interaction[];
}
