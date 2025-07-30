import { DataSource } from "typeorm";
const dataSource = new DataSource({
	type: "postgres",
	database: "db_footsy",
	entities: [],
	synchronize: true,
	logging: ["error", "query"],
});
export default dataSource;
