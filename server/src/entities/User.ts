import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Avatar from "./Avatar";
import Friend from "./Friend";
import Interaction from "./Interaction";
import Activity from "./Activity";

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
  @OneToOne(() => Avatar, (avatar) => avatar.users)
  @JoinColumn({ name: "avatar_id" })
  avatar: Avatar;

  @OneToMany(() => Friend, friend => friend.requester)
  sentFriendRequests: Friend[];

  @OneToMany(() => Friend, friend => friend.requested)
  receivedFriendRequests: Friend[];

  @Field(() => Interaction)
  @ManyToOne(() => Interaction, (interaction) => interaction.users)
  interaction: Interaction;

  @Field(() => Activity)
  @OneToMany(() => Activity, (activity) => activity.users)
  activities: Activity;
}
