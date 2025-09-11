import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import UserService from "../UserService";
import { createMockUser } from "../../__tests__/helpers";

import type User from "../../entities/User";

jest.mock("argon2", () => ({
  verify: jest.fn(),
}));

// Mock des entités avec les méthodes statiques et constructeurs
jest.mock("../../entities/User", () => {
  return jest.fn().mockImplementation(() => ({
    id: 1,
    email: "test@example.com",
    first_name: "Jane",
    last_name: "Doe",
    birthdate: new Date("1990-08-04"),
    hashed_password: "hashedPassword123",
    avatar: null,
    activities: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    interactions: [],
  }));
});

jest.mock("../../entities/Avatar", () => {
  return jest.fn().mockImplementation(() => ({
    id: 1,
    title: "Default Avatar",
    image: "avatar.jpg",
    users: [],
  }));
});

// Mock des méthodes statiques après la définition des mocks
const MockedUser = jest.mocked(require("../../entities/User"));
MockedUser.findOne = jest.fn();

describe("UserService", () => {
  let userService: UserService;
  let mockUser: User;

  beforeEach(() => {
    // Create service instance
    userService = new UserService();

    // Create mock user using helper
    mockUser = createMockUser({
      email: "test@example.com",
      hashed_password: "hashedPassword123",
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should return user when email exists", async () => {
      // Arrange
      const email = "test@example.com";
      MockedUser.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await userService.findByEmail(email);

      // Assert
      expect(MockedUser.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ["avatar"],
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null when email does not exist", async () => {
      // Arrange
      const email = "nonexistent@example.com";
      MockedUser.findOne.mockResolvedValue(null);

      // Act
      const result = await userService.findByEmail(email);

      // Assert
      expect(MockedUser.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ["avatar"],
      });
      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      // Arrange
      const email = "test@example.com";
      const dbError = new Error("Database connection failed");
      MockedUser.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(userService.findByEmail(email)).rejects.toThrow(
        "Database connection failed"
      );

      expect(MockedUser.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ["avatar"],
      });
    });
  });

  describe("authenticateUser", () => {
    it("should successfully authenticate user with valid credentials", async () => {
      const email = "test@example.com";
      const password = "validPassword123";
      const mockArgon2 = jest.mocked(require("argon2"));

      MockedUser.findOne.mockResolvedValue(mockUser);
      mockArgon2.verify.mockResolvedValue(true);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(MockedUser.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ["avatar"],
      });
      expect(mockArgon2.verify).toHaveBeenCalledWith(
        mockUser.hashed_password,
        password
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user is not found", async () => {
      const email = "nonexistent@example.com";
      const password = "anyPassword123";
      MockedUser.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.authenticateUser(email, password)
      ).rejects.toThrow("User not found");

      expect(MockedUser.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ["avatar"],
      });
    });

    it("should throw error when password is invalid", async () => {
      const email = "test@example.com";
      const password = "wrongPassword123";
      const mockArgon2 = jest.mocked(require("argon2"));

      MockedUser.findOne.mockResolvedValue(mockUser);
      mockArgon2.verify.mockResolvedValue(false);

      // Act & Assert
      await expect(
        userService.authenticateUser(email, password)
      ).rejects.toThrow("Invalid password");

      expect(MockedUser.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ["avatar"],
      });
      expect(mockArgon2.verify).toHaveBeenCalledWith(
        mockUser.hashed_password,
        password
      );
    });
  });
});
