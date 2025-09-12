import dataSource from "../config/db";
import { Users } from "./data/UserSeeder";
import { Avatars } from "./data/AvatarSeeder";
import Avatar from "../entities/Avatar";
import User from "../entities/User";

async function generateAndSaveFixtures() {
  try {
    await dataSource.initialize();
    await dataSource.synchronize(true);
    
await dataSource.getRepository(Avatar).save(Avatars);

    const savedUsers = await dataSource
      .getRepository(User)
      .save(Users);

    console.info("Seeded users:", savedUsers);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
generateAndSaveFixtures();