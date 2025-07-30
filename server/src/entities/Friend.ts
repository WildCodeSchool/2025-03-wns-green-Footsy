import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
@Unique(["requested", "requested"])
@Entity()
export default class Friend extends BaseEntity {
    @Field(()=> User)
    @ManyToOne(() => User, user => user.sentFriends, { eager: true })
    @PrimaryColumn()
    requester: User;

    @Field(()=> User)
    @ManyToOne(() => User, user => user.receivedFriends, { eager: true })
    @PrimaryColumn()
    requested: User;

    @Field(()=> Boolean)
    @Column({ type: "boolean", default: "false" })
    accepted: boolean;
}
