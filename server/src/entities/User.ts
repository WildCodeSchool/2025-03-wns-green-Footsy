import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Avatar } from "./Avatar";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column("varchar")
	first_name: string;

	@Field()
	@Column("varchar")
	last_name: string;

	@Field()
	@Column("varchar")
	email: string;

	@Field()
	@Column("varchar")
	hashed_password: string;

	@Field()
	@Column("varchar")
	birthdate: Date;

	@Field(() => Avatar)
	@ManyToOne(
		() => Avatar,
		(avatar) => avatar.users,
	)
	avatar: Avatar;
}
