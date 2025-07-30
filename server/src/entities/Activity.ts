import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Field, Int, ObjectType, Float } from "type-graphql";
import { Type } from "./Type";

/**
 * Activity entity - Represents an activity
 */
@ObjectType()
@Entity()
export class Activity extends BaseEntity {
  /**
   * Unique activity identifier
   * Primary key auto-generated
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Activity title
   * Example: "Transport en vélo", "Recyclage papier"
   */
  @Field(() => String)
  @Column("varchar", { length: 50 })
  title: string;

  /**
   * Activity quantity
   * Example: number of kilometers, number of objects recycled
   * Nullable depending on the image
   */
  @Field(() => Float, { nullable: true })
  @Column("float", { nullable: true })
  quantity: number;

  /**
   * Date of the activity
   */
  @Field(() => String)
  @Column("date")
  date: string;

  /**
   * CO2 equivalent in kg generated or saved by this activity
   * Positive value = CO2 saved
   * Negative value = CO2 generated
   */
  @Field(() => Float)
  @Column("float")
  co2_equivalent: number;

  /**
   * User identifier
   * Foreign key to the user table
   */
  @Field(() => Int)
  @Column("int")
  user_id: number;

  /**
   * Activity type identifier
   * Foreign key to the type table
   */
  @Field(() => Int)
  @Column("int")
  type_id: number;

  /**
   * Many-to-one relationship with the Type entity
   * A type can have many activities
   */
  @ManyToOne(() => Type, type => type.activities)
  @JoinColumn({ name: "type_id" })
  type: Type;
} 