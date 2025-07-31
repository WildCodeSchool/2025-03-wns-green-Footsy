import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import User from "./User";
import Activity from "./Activity";

@ObjectType()
@Entity()
export default class Interaction extends BaseEntity {
    @Field(() => User)
    @ManyToOne(() => User, user => user.interactions, { nullable: false })
    users: User[];

    @Field(() => Activity)
    @ManyToOne(() => Activity, activity => activity.interactions, { nullable: false })
    activity: Activity[];

    @Field(() => String)
    @Column("text")
    comment: string;

    @Field(() => Date)
    @Column("date")
    comment_date: Date;
}