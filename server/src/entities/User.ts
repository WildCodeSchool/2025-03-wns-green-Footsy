import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import Avatar from "./Avatar";
import Friend from "./Friend"

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=> String)
  @Column("varchar")
  first_name: string;

  @Field(()=> String)
  @Column("varchar")
  last_name: string;

  @Field(()=> String)
  @Column("varchar")
  email: string;

  @Field(()=> String)
  @Column("varchar")
  hashed_password: string;

  @Field(()=> Date)
  @Column("varchar")
  birthdate: Date;

  @Field(() => Avatar)
  @ManyToOne(() => Avatar, (avatar) => avatar.users)
  avatar: Avatar;

  @OneToMany(() => Friend, friend => friend.requester)
  sentFriends: Friend[];

  @OneToMany(() => Friend, friend => friend.requested)
  receivedFriends: Friend[];
}
