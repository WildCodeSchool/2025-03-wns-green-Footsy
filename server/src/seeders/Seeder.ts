import dataSource from "../config/db";
import { Users } from "./data/UserSeeder";

async function generateAndSaveFixtures() {
  try {
    await dataSource.initialize();
    await dataSource.synchronize(true);

    const savedUsers = await dataSource
      .getRepository("User")
      .save(Users);

    console.info("Seeded users:", savedUsers);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
generateAndSaveFixtures();