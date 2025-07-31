import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Unique } from "typeorm";
import User from "./User";
import Activity from "./Activity";

@ObjectType()
@Unique(["user_id", "activity_id"])
@Entity()
export default class Interaction extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn({ type: "int" })
    user_id: number;

    @ManyToOne(() => User, user => user.interactions, { nullable: false })
    users: User[];

    @Field(() => Int)
    @PrimaryColumn({ type: "int" })
    activity_id: number;

    @ManyToOne(() => Activity, activity => activity.interactions, { nullable: false })
    activity: Activity[];

    @Field(() => String)
    @Column("text")
    comment: string;

    @Field(() => Date)
    @Column("date")
    comment_date: Date;
}