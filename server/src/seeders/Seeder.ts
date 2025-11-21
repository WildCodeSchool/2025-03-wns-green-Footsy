import dataSource from "../config/db";
import { Users } from "./data/UserSeeder";
import { Avatars } from "./data/AvatarSeeder";
import Avatar from "../entities/Avatar";
import User from "../entities/User";

export async function seedAvatars() {
  const avatarRepository = dataSource.getRepository(Avatar);
  const existingAvatars = await avatarRepository.find();
  if (existingAvatars.length === 0) {
    await avatarRepository.save(Avatars);
    console.info("Avatars seeded");
  } else {
    console.info("Avatars already exist, skipping seeding");
  }
}

export async function seedUsers() {
  const userRepository = dataSource.getRepository(User);
  const avatarRepository = dataSource.getRepository(Avatar);
  
  // Check if avatars exist
  const existingAvatars = await avatarRepository.find();
  if (existingAvatars.length === 0) {
    console.warn("No avatars found. Please seed avatars first.");
    return;
  }
  
  // Check if users exist
  const existingUsers = await userRepository.find();
  if (existingUsers.length > 0) {
    console.info("Users already exist, skipping seeding");
    return;
  }
  
  // Seedear users
  await userRepository.save(Users);
  console.info("Users seeded");
}

async function generateAndSaveFixtures() {
  try {
    await dataSource.initialize();
    await dataSource.synchronize(true);

    await dataSource.getRepository(Avatar).save(Avatars);

    const savedUsers = await dataSource.getRepository(User).save(Users);

    console.info("Seeded users:", savedUsers);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
// generateAndSaveFixtures();
