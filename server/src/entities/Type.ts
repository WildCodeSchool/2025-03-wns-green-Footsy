import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Activity } from "./Activity";
import { Category } from "./Category";

/**
 * Type entity - Represents an activity type
 * This entity defines the different activity types and their measurement units
 */
@ObjectType()
@Entity()
export class Type extends BaseEntity {
  /**
   * Unique activity type identifier
   * Primary key auto-generated
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Activity type title
   * Example: "Transport", "Recycling", "Energy"
   */
  @Field(() => String)
  @Column("varchar")
  title: string;

  /**
   * Measurement unit for the quantity
   * Example: "km", "kg", "kWh", "objects"
   */
  @Field(() => String)
  @Column("varchar")
  quantity_unit: string;

  /**
   * Category identifier
   * Foreign key to the category table
   */
  @Field(() => Int)
  @Column("int")
  category_id: number;

  /**
   * Many-to-one relationship with the Category entity
   * A category can have many types
   */
  @ManyToOne(() => Category, category => category.types)
  @JoinColumn({ name: "category_id" })
  category: Category;

  /**
   * One-to-many relationship with the Activity entity
   * A type can have many activities
   */
  @OneToMany(() => Activity, activity => activity.type)
  activities: Activity[];
}
