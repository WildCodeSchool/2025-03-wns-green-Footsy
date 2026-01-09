import "dotenv/config";
import "reflect-metadata";

import dataSource from "../config/db";
import { Users } from "./data/UserSeeder";
import { Avatars } from "./data/AvatarSeeder";
import Avatar from "../entities/Avatar";
import User from "../entities/User";
import Category from "../entities/Category";
import Type from "../entities/Type";
import Activity from "../entities/Activity";
import { Activities } from "./data/ActivitySeeder";
import ApiAdemeService from "../services/apiAdeme/ApiAdeme.service";


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

export async function seedCategories() {
  const categoryRepo = dataSource.getRepository(Category);
  if (await categoryRepo.count()) {
    console.info("Categories already exist, skipping");
    return;
  }

  console.info("Fetching categories from ADEME API...");

  try {
    const categoriesFromApi = await ApiAdemeService.getCategories()

    console.info(`✓ ${categoriesFromApi.length} categories retrieved`);

    const categoriesToSave = categoriesFromApi.map((cat) => {
      const quantityUnit = ApiAdemeService.getQuantityUnit(cat.id);
      if (!quantityUnit) {
        console.warn(`Category "${cat.name}" (id: ${cat.id}) has no quantity_unit, skipping`);
        return null;
      }
      return {
        title: cat.name,
        quantity_unit: quantityUnit
      };
    });

    console.info(`✓ ${categoriesToSave.length} categories prepared for saving`);

    await categoryRepo.save(categoriesToSave);
    console.info("Categories seeded");

  } catch (error) {
    console.error("Erreur lors du seed des categories:", error);
    throw error;
  }
}

export async function seedTypes() {
  const typeRepo = dataSource.getRepository(Type);
  if (await typeRepo.count()) {
    console.info("Types already exist, skipping");
    return;
  }

  const categoryRepo = dataSource.getRepository(Category);
  const categories = await categoryRepo.find();
  if (categories.length === 0) {
    console.warn("No categories found, seed categories first");
    return;
  }

  console.info("Fetching types from ADEME API...");

  try {
    const allTypesToSave = [];

    for (const category of categories) {
      console.info(`Fetching types for category: ${category.title}...`);

      const typesFromApi = await ApiAdemeService.getTypes(category.id);

      const typesForCategory = typesFromApi.map((type) => ({
        title: type.name,
        ecv: type.ecv,
        category: category
      }));

      allTypesToSave.push(...typesForCategory);
    }

    console.info(`✓ ${allTypesToSave.length} types prepared for saving`);

    await typeRepo.save(allTypesToSave);
    console.info("Types seeded");

  } catch (error) {
    console.error("Erreur lors du seed des types:", error);
    throw error;
  }

}

export async function seedActivities() {
  const activityRepo = dataSource.getRepository(Activity);
  if (await activityRepo.count()) {
    console.info("Activities already exist, skipping");
    return;
  }

  const userRepo = dataSource.getRepository(User);
  const typeRepo = dataSource.getRepository(Type);

  const activities = [];

  for (const data of Activities) {
    const user = await userRepo.findOneByOrFail({ email: data.user_email });
    const type = await typeRepo.findOneByOrFail({ title: data.type_title });
    activities.push({
      title: data.title,
      quantity: data.quantity,
      date: data.date,
      co2_equivalent: data.co2_equivalent,
      user,
      type,
    });
  }

  await activityRepo.save(activities);
  console.info("Activities seeded");
}

async function runSeeders() {
  try {
    await dataSource.initialize();
    console.info("Database connected");

    await seedAvatars();
    await seedUsers();
    await seedCategories();
    await seedTypes();
    await seedActivities();

    console.info("All seeders completed successfully")
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    process.exit(0);
  }
}

runSeeders();