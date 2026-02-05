import "reflect-metadata";

import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import * as argon2 from "argon2";

import dataSource from "../../config/db";
import UserResolver from "../../resolvers/UserResolver";
import ActivityResolver from "../../resolvers/ActivityResolver";
import AvatarResolver from "../../resolvers/AvatarResolver";
import CategoryResolver from "../../resolvers/CategoryResolver";
import FriendResolver from "../../resolvers/FriendResolver";
import InteractionResolver from "../../resolvers/InteractionResolver";
import TypeResolver from "../../resolvers/TypeResolver";
import Activity from "../../entities/Activity";
import Avatar from "../../entities/Avatar";
import Category from "../../entities/Category";
import Interaction from "../../entities/Interaction";
import Type from "../../entities/Type";
import User from "../../entities/User";

const TEST_USER_EMAIL = "activities-test@footsy.com";

const GET_ACTIVITIES_QUERY = `
  query GetActivitiesByUserIdAndFilters($data: ActivityFilterInput!) {
    getActivitiesByUserIdAndFilters(data: $data) {
      id
      title
      quantity
      date
      co2_equivalent
      type { id title category { id title } }
    }
  }
`;

describe("getActivitiesByUserIdAndFilters (integration)", () => {
  let apolloServer: ApolloServer;
  let testUserId: number;
  let category1Id: number;

  beforeAll(async () => {
    await dataSource.initialize();

    // Ensure at least one avatar exists (User has required avatar relation)
    const avatarRepo = dataSource.getRepository(Avatar);
    let avatar = await avatarRepo.findOne({ where: {} });
    if (!avatar) {
      avatar = await avatarRepo.save(
        avatarRepo.create({ title: "Test Avatar", image: "test.png" })
      );
    }

    // Create dedicated user for this test (respect FK: Interaction -> Activity -> User)
    const userRepo = dataSource.getRepository(User);
    const existingUser = await userRepo.findOne({ where: { email: TEST_USER_EMAIL } });
    if (existingUser) {
      const activityIds = await dataSource
        .getRepository(Activity)
        .find({ where: { user: { id: existingUser.id } }, select: { id: true } })
        .then((rows) => rows.map((r) => r.id));
      if (activityIds.length > 0) {
        await dataSource
          .createQueryBuilder()
          .delete()
          .from(Interaction)
          .where("activity_id IN (:...ids)", { ids: activityIds })
          .execute();
      }
      await dataSource.getRepository(Activity).delete({ user: { id: existingUser.id } });
      await userRepo.remove(existingUser);
    }
    const testUser = await userRepo.save(
      userRepo.create({
        first_name: "Activities",
        last_name: "Test",
        email: TEST_USER_EMAIL,
        hashed_password: await argon2.hash("any"),
        birthdate: new Date("1990-01-01"),
        isAdmin: false,
        avatar,
      })
    );
    testUserId = testUser.id;

    // Create two categories (with quantity_unit)
    const categoryRepo = dataSource.getRepository(Category);
    const category1 = await categoryRepo.save(
      categoryRepo.create({ title: "Transport", quantity_unit: "km" })
    );
    const category2 = await categoryRepo.save(
      categoryRepo.create({ title: "Alimentation", quantity_unit: "kg" })
    );
    category1Id = category1.id;

    // Create two types (one per category, must provide ecv)
    const typeRepo = dataSource.getRepository(Type);
    const type1 = await typeRepo.save(
      typeRepo.create({
        title: "Voiture",
        ecv: 1.23,
        category: category1,
        category_id: category1.id,
      })
    );
    const type2 = await typeRepo.save(
      typeRepo.create({
        title: "Viande",
        ecv: 2.34,
        category: category2,
        category_id: category2.id,
      })
    );

    // Create two activities for the test user
    const activityRepo = dataSource.getRepository(Activity);
    await activityRepo.save(
      activityRepo.create({
        title: "Trip to work",
        quantity: 15,
        date: new Date("2024-01-15"),
        co2_equivalent: 3.2,
        user: testUser,
        type: type1,
      })
    );
    await activityRepo.save(
      activityRepo.create({
        title: "Lunch meat",
        quantity: 0.5,
        date: new Date("2024-01-16"),
        co2_equivalent: 2.8,
        user: testUser,
        type: type2,
      })
    );

    // Build GraphQL schema (same resolvers as app)
    const schema = await buildSchema({
      resolvers: [
        UserResolver,
        ActivityResolver,
        TypeResolver,
        CategoryResolver,
        AvatarResolver,
        FriendResolver,
        InteractionResolver,
      ],
    });

    apolloServer = new ApolloServer({ schema });
    await apolloServer.start();
  }, 20000);

  afterAll(async () => {
    await apolloServer?.stop();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should return all activities for a user when no category filter is provided", async () => {
    // Act
    const response = await apolloServer.executeOperation(
      {
        query: GET_ACTIVITIES_QUERY,
        variables: {
          data: { user_id: testUserId },
        },
      },
      { contextValue: { token: null } }
    );

    // Assert
    expect(response.body.kind).toBe("single");
    if (response.body.kind !== "single") return;

    const singleResult = response.body.singleResult;
    expect(singleResult.errors).toBeUndefined();
    expect(singleResult.data).toBeDefined();
    const activities = singleResult.data?.getActivitiesByUserIdAndFilters as unknown[];
    expect(activities).toBeDefined();
    expect(activities).toHaveLength(2);
  });

  it("should return only activities in the given category when category_id is provided", async () => {
    // Act
    const response = await apolloServer.executeOperation(
      {
        query: GET_ACTIVITIES_QUERY,
        variables: {
          data: { user_id: testUserId, category_id: category1Id },
        },
      },
      { contextValue: { token: null } }
    );

    // Assert
    expect(response.body.kind).toBe("single");
    if (response.body.kind !== "single") return;

    const singleResult = response.body.singleResult;
    expect(singleResult.errors).toBeUndefined();
    expect(singleResult.data).toBeDefined();
    const activities = singleResult.data?.getActivitiesByUserIdAndFilters as { type: { category: { id: number } } }[];
    expect(activities).toBeDefined();
    expect(activities).toHaveLength(1);
    expect(activities[0].type.category.id).toBe(category1Id);
  });

  it("should return error when user is not found", async () => {
    // Act
    const response = await apolloServer.executeOperation(
      {
        query: GET_ACTIVITIES_QUERY,
        variables: {
          data: { user_id: 99999 },
        },
      },
      { contextValue: { token: null } }
    );

    // Assert
    expect(response.body.kind).toBe("single");
    if (response.body.kind !== "single") return;

    const singleResult = response.body.singleResult;
    expect(singleResult.errors).toBeDefined();
    expect(singleResult.errors?.length).toBeGreaterThan(0);
    expect(singleResult.errors?.[0]?.message).toContain("User not found");
  });
});
