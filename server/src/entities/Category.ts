import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Type } from "./Type";

/**
 * Category entity - Represents a category
 */
@ObjectType()
@Entity()
export class Category extends BaseEntity {
  /**
   * Unique category identifier
   * Primary key auto-generated
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Category title
   * Example: "Transport", "Alimentation", "Énergie"
   */
  @Field(() => String)
  @Column("varchar", { length: 50 })
  title: string;

  /**
   * One-to-many relationship with the Type entity
   * A category can have many types
   */
  @OneToMany(() => Type, type => type.category)
  types: Type[];
} 