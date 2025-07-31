import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Unique(["requester_id", "requested_id"])
@Entity()
export default class Friend extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn({ type: "int" })
    requester_id: number;

    @Field(() => Int)
    @PrimaryColumn({ type: "int" })
    requested_id: number;

    @ManyToOne(() => User, (user) => user.sentFriendRequests, { eager: true })
    requester: User;

    @ManyToOne(() => User, (user) => user.receivedFriendRequests, { eager: true })
    requested: User;

    @Field(() => Boolean)
    @Column({ type: "boolean", default: "false" })
    accepted: boolean;
}
