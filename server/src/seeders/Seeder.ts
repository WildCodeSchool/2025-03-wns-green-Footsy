import dataSource from "../config/db";
import { Users } from "./data/UserSeeder";
import { Avatars } from "./data/AvatarSeeder";
import Avatar from "../entities/Avatar";
import User from "../entities/User";
import Category from "../entities/Category";
import Type from "../entities/Type";
import { Categories } from "./data/CategorySeeder";
import { Types } from "./data/TypeSeeder";
import Activity from "../entities/Activity";
import { Activities } from "./data/ActivitySeeder";

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
  await categoryRepo.save(Categories);
  console.info("Categories seeded");
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

  // Map Types with category relation
  const typesToSave = Types.map((typeData) => {
    const category = categories.find((cat) => cat.id === typeData.category_id);
    if (!category) {
      throw new Error(`Category with id ${typeData.category_id} not found`);
    }
    return {
      ...typeData,
      category: category,
    };
  });

  await typeRepo.save(typesToSave);
  console.info("Types seeded");
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
