import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany } from "typeorm";
import User from "./User";
import Activity from "./Activity";

@ObjectType()
@Entity()
export default class Interaction extends BaseEntity {
    @Field(() => User)
    @OneToMany(() => User, (user) => user.interaction)
    users: User[];

    @Field(() => Activity)
    @OneToMany(() => Activity, (activity) => activity.interaction)
    activities: User[];

    @Field(() => String)
    @Column("text")
    comment: string;

    @Field(() => Date)
    @Column("varchar")
    comment_date: Date;
}