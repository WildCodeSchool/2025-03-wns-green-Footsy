import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import UserService from "../UserService";
import { createMockUser, createMockAvatar } from "../../__tests__/helpers";

import type User from "../../entities/User";

jest.mock("argon2", () => ({
  verify: jest.fn(),
  hash: jest.fn(),
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
    save: jest.fn(),
  }));
});

// Mock des méthodes statiques après la définition des mocks
const MockedUser = jest.mocked(require("../../entities/User"));
MockedUser.findOne = jest.fn();
MockedUser.findOneByOrFail = jest.fn();
MockedUser.remove = jest.fn();

const MockedAvatar = jest.mocked(require("../../entities/Avatar"));
MockedAvatar.findOneByOrFail = jest.fn();

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

  describe("updatePersonalInfo", () => {
    it("should update user personal information successfully", async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        first_name: "Updated",
        last_name: "Name",
        birthdate: new Date("1995-01-01T00:00:00.000Z"),
      };
      const updatedUser = createMockUser({
        id: userId,
        first_name: updateData.first_name,
        last_name: updateData.last_name,
      });

      MockedUser.findOneByOrFail.mockResolvedValue(mockUser);
      mockUser.save = jest.fn(() => Promise.resolve(updatedUser)) as any;

      // Act
      const result = await userService.updatePersonalInfo(userId, updateData);

      // Assert
      expect(MockedUser.findOneByOrFail).toHaveBeenCalledWith({ id: userId });
      expect(mockUser.first_name).toBe(updateData.first_name);
      expect(mockUser.last_name).toBe(updateData.last_name);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it("should throw error when user does not exist", async () => {
      // Arrange
      const userId = 999;
      const updateData = {
        first_name: "Updated",
        last_name: "Name",
        birthdate: new Date("1995-01-01T00:00:00.000Z"),
      };

      MockedUser.findOneByOrFail.mockRejectedValue(new Error("User not found"));

      // Act & Assert
      await expect(
        userService.updatePersonalInfo(userId, updateData)
      ).rejects.toThrow("User not found");
    });
  });

  describe("updateAvatar", () => {
    it("should update user avatar successfully", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 2;
      const mockAvatar = createMockAvatar({
        id: 2,
        title: "New Avatar",
        image: "new.jpg",
      });
      const updatedUser = createMockUser({ id: userId, avatar: mockAvatar });

      MockedUser.findOneByOrFail.mockResolvedValue(mockUser);
      MockedAvatar.findOneByOrFail.mockResolvedValue(mockAvatar);
      mockUser.save = jest.fn(() => Promise.resolve(updatedUser)) as any;

      // Act
      const result = await userService.updateAvatar(userId, avatarId);

      // Assert
      expect(MockedUser.findOneByOrFail).toHaveBeenCalledWith({ id: userId });
      expect(MockedAvatar.findOneByOrFail).toHaveBeenCalledWith({
        id: avatarId,
      });
      expect(mockUser.avatar).toEqual(mockAvatar);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it("should throw error when avatar does not exist", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 999;

      MockedUser.findOneByOrFail.mockResolvedValue(mockUser);
      MockedAvatar.findOneByOrFail.mockRejectedValue(
        new Error("Avatar not found")
      );

      // Act & Assert
      await expect(userService.updateAvatar(userId, avatarId)).rejects.toThrow(
        "Avatar not found"
      );
    });

    it("should throw error when user does not exist", async () => {
      // Arrange
      const userId = 999;
      const avatarId = 2;

      MockedUser.findOneByOrFail.mockRejectedValue(new Error("User not found"));

      // Act & Assert
      await expect(userService.updateAvatar(userId, avatarId)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("changePassword", () => {
    it("should hash new password before saving to database", async () => {
      // Arrange
      const userId = 1;
      const currentPassword = "oldPassword123";
      const newPassword = "newPassword456";
      const hashedPassword = "$argon2id$v=19$m=65536...";
      const mockArgon2 = jest.mocked(require("argon2"));

      MockedUser.findOneByOrFail.mockResolvedValue(mockUser);
      mockArgon2.verify.mockResolvedValue(true);
      mockArgon2.hash.mockResolvedValue(hashedPassword);
      mockUser.save = jest.fn(() => Promise.resolve(mockUser)) as any;

      // Act
      const result = await userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      // Assert
      expect(MockedUser.findOneByOrFail).toHaveBeenCalledWith({ id: userId });

      expect(mockArgon2.verify).toHaveBeenCalledWith(
        "hashedPassword123",
        currentPassword
      );
      expect(mockArgon2.hash).toHaveBeenCalledWith(newPassword);

      expect(mockUser.hashed_password).toBe(hashedPassword);
      expect(mockUser.hashed_password).not.toBe(newPassword);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw error when current password is incorrect", async () => {
      // Arrange
      const userId = 1;
      const currentPassword = "wrongPassword123";
      const newPassword = "newPassword456";
      const mockArgon2 = jest.mocked(require("argon2"));

      MockedUser.findOneByOrFail.mockResolvedValue(mockUser);
      mockArgon2.verify.mockResolvedValue(false);

      // Act & Assert
      await expect(
        userService.changePassword(userId, currentPassword, newPassword)
      ).rejects.toThrow("Current password is incorrect");

      expect(mockArgon2.verify).toHaveBeenCalledWith(
        mockUser.hashed_password,
        currentPassword
      );
      expect(mockArgon2.hash).not.toHaveBeenCalled();
    });

    it("should throw error when user does not exist", async () => {
      // Arrange
      const userId = 999;
      const currentPassword = "oldPassword123";
      const newPassword = "newPassword456";

      MockedUser.findOneByOrFail.mockRejectedValue(new Error("User not found"));

      // Act & Assert
      await expect(
        userService.changePassword(userId, currentPassword, newPassword)
      ).rejects.toThrow("User not found");
    });
  });

  describe("deleteAccount", () => {
    it("should delete user account successfully", async () => {
      // Arrange
      const userId = 1;

      MockedUser.findOneByOrFail.mockResolvedValue(mockUser);
      MockedUser.remove.mockResolvedValue(undefined);

      // Act
      const result = await userService.deleteAccount(userId);

      // Assert
      expect(MockedUser.findOneByOrFail).toHaveBeenCalledWith({ id: userId });
      expect(MockedUser.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(true);
    });

    it("should throw error when user does not exist", async () => {
      // Arrange
      const userId = 999;

      MockedUser.findOneByOrFail.mockRejectedValue(new Error("User not found"));

      // Act & Assert
      await expect(userService.deleteAccount(userId)).rejects.toThrow(
        "User not found"
      );
    });
  });
});
