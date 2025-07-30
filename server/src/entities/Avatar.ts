import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Avatar extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar")
  title: string;

  @Field(() => String)
  @Column("varchar")
  image: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.avatar)
  users: User[];
}
