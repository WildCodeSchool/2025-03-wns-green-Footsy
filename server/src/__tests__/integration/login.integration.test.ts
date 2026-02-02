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
import Avatar from "../../entities/Avatar";
import User from "../../entities/User";

const TEST_USER_EMAIL = "integration-test@footsy.com";
const TEST_USER_PASSWORD = "TestPassword123";

const LOGIN_MUTATION = `
  mutation Login($data: UserInput!) {
    login(data: $data)
  }
`;

describe("Login mutation (integration)", () => {
  let apolloServer: ApolloServer;

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

    // Remove existing test user so we can create a fresh one with known password
    const userRepo = dataSource.getRepository(User);
    await userRepo.delete({ email: TEST_USER_EMAIL });

    // Create test user with known password
    await userRepo.save(
      userRepo.create({
        first_name: "Integration",
        last_name: "Test",
        email: TEST_USER_EMAIL,
        hashed_password: await argon2.hash(TEST_USER_PASSWORD),
        birthdate: new Date("1990-01-01"),
        isAdmin: false,
        avatar,
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

  it("should return token and user data when login credentials are valid", async () => {
    // Act
    const response = await apolloServer.executeOperation(
      {
        query: LOGIN_MUTATION,
        variables: {
          data: {
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
          },
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
    expect(singleResult.data?.login).toBeDefined();

    const loginResult = singleResult.data?.login as string;
    expect(loginResult).toContain(`"mail":"${TEST_USER_EMAIL}"`);
    expect(loginResult).toContain("token=");
    expect(loginResult).toMatch(/token=[^;]+/);
  });

  it("should return login error when password is invalid", async () => {
    // Act
    const response = await apolloServer.executeOperation(
      {
        query: LOGIN_MUTATION,
        variables: {
          data: {
            email: TEST_USER_EMAIL,
            password: "WrongPassword123",
          },
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
    expect(singleResult.errors?.[0]?.message).toContain("Login error");
  });
});
