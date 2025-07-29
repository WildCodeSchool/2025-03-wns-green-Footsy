import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "footsy_db",
  entities: [],
  synchronize: true,
  logging: ["error", "query"],
});

export default dataSource;
