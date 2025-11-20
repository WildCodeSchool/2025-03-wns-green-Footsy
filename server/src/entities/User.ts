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
import Avatar from "./Avatar";
import Friend from "./Friend";
import Interaction from "./Interaction";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  first_name: string;

  @Field(() => String)
  @Column("varchar", { length: 50 })
  last_name: string;

  @Field(() => String)
  @Column({ type: "varchar", unique: true, length: 50 })
  email: string;

  @Column("varchar", { length: 255 })
  hashed_password: string;

  @Field(() => String)
  @Column("date")
  birthdate: Date;

  @Field(() => Avatar)
  @ManyToOne(() => Avatar, (avatar) => avatar.users, { nullable: false })
  @JoinColumn({ name: "avatar_id" })
  avatar: Avatar;

  @OneToMany(() => Friend, (friend) => friend.requester)
  sentFriendRequests: Friend[];

  @OneToMany(() => Friend, (friend) => friend.requested)
  receivedFriendRequests: Friend[];

  @Field(() => Interaction)
  @OneToMany(() => Interaction, (interaction) => interaction.users)
  interactions: Interaction[];

  @Field(() => [Activity])
  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
