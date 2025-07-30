import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Activity } from "../entities/Activity";
import { Type } from "../entities/Type";


const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "db_footsy",
  entities: [User, Activity, Type], // Add Activity and Type entities
  synchronize: true,
  logging: ["error", "query"],
});

export default dataSource;
