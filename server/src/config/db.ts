import { DataSource } from "typeorm";
import { Avatar } from "../entities/Avatar";
import { User } from "../entities/User";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "db_footsy",
  entities: [User, Avatar],
  synchronize: true,
  logging: ["error", "query"],
});

export default dataSource;
