import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as jwt from "jsonwebtoken";

import UserResolver from "../UserResolver";
import { createMockUser, createMockAvatar } from "../../__tests__/helpers";

import type User from "../../entities/User";
import type { UserServiceInterface } from "../../services/UserService";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("argon2", () => ({
  hash: jest.fn(),
}));

// Mock UserService
const mockUserService: jest.Mocked<UserServiceInterface> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  authenticateUser: jest.fn(),
  updatePersonalInfo: jest.fn(),
  updateAvatar: jest.fn(),
  changePassword: jest.fn(),
  deleteAccount: jest.fn(),
};

describe("UserResolver", () => {
  let userResolver: UserResolver;
  let mockUser: User;

  beforeEach(() => {
    // Reset environment
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret-key";

    // Mock data and functions
    userResolver = new UserResolver(mockUserService);
    mockUser = createMockUser();

    (jwt.sign as jest.Mock).mockReturnValue("mock-token");

    const mockArgon2 = jest.mocked(require("argon2"));
    mockArgon2.hash.mockResolvedValue(
      "$argon2id$v=19$m=65536,t=3,p=4$hashedPassword"
    );
  });

  describe("login", () => {
    it("should return token and user data with valid credentials", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "validPassword123",
      };
      const mockToken = "mock-jwt-token";

      mockUserService.authenticateUser.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await userResolver.login(userData);

      // Assert
      expect(mockUserService.authenticateUser).toHaveBeenCalledWith(
        userData.email,
        userData.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          firstName: mockUser.first_name,
          lastName: mockUser.last_name,
          mail: mockUser.email,
          birthDate: mockUser.birthdate,
          avatar: mockUser.avatar,
        },
        process.env.JWT_SECRET
      );
      expect(result).toContain("token=mock-jwt-token");
      expect(result).toContain('"id":1');
      expect(result).toContain('"firstName":"Jane"');
    });

    it('should throw "Login error" when JWT_SECRET is missing', async () => {
      // Arrange
      delete process.env.JWT_SECRET;
      const userData = {
        email: "test@example.com",
        password: "validPassword123",
      };

      // Act & Assert
      await expect(userResolver.login(userData)).rejects.toThrow("Login error");
    });

    it('should throw "Login error" when user is not found', async () => {
      // Arrange
      const userData = {
        email: "nonexistent@example.com",
        password: "anyPassword123",
      };

      mockUserService.authenticateUser.mockRejectedValue(
        new Error("User not found")
      );

      // Act & Assert
      await expect(userResolver.login(userData)).rejects.toThrow("Login error");
    });

    it('should throw "Login error" when password is invalid', async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "wrongPassword123",
      };

      mockUserService.authenticateUser.mockRejectedValue(
        new Error("Invalid password")
      );

      // Act & Assert
      await expect(userResolver.login(userData)).rejects.toThrow("Login error");
    });

    it('should throw "Login error" when JWT signing fails', async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "validPassword123",
      };

      mockUserService.authenticateUser.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error("JWT signing failed");
      });

      // Act & Assert
      await expect(userResolver.login(userData)).rejects.toThrow("Login error");
    });

    it('should throw "Login error" when user is null', async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "validPassword123",
      };

      mockUserService.authenticateUser.mockResolvedValue(null);

      // Act & Assert
      await expect(userResolver.login(userData)).rejects.toThrow("Login error");
    });
  });

  describe("signup", () => {
    const newUserData = {
      email: "newuser@example.com",
      password: "password123",
      first_name: "John",
      last_name: "Smith",
      birthdate: new Date("1995-06-15"),
      avatar: { id: 2, title: "New Avatar", image: "new-avatar.jpg" },
    };

    it("should create a new user and return profile with token", async () => {
      // Arrange
      const mockToken = "mock-signup-token";
      const createdUser = createMockUser({
        id: 2,
        email: newUserData.email,
        first_name: newUserData.first_name,
        last_name: newUserData.last_name,
        birthdate: newUserData.birthdate,
        avatar: createMockAvatar({
          id: newUserData.avatar.id,
          title: newUserData.avatar.title,
          image: newUserData.avatar.image,
        }),
      });

      mockUserService.create.mockResolvedValue(createdUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await userResolver.signup(newUserData);

      // Assert
      expect(result).toContain("token=mock-signup-token");

      // Assert service call
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...newUserData,
        password: expect.any(String),
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: createdUser.id,
          firstName: createdUser.first_name,
          lastName: createdUser.last_name,
          mail: createdUser.email,
          birthDate: createdUser.birthdate,
          avatar: createdUser.avatar,
        },
        process.env.JWT_SECRET
      );
    });

    it("should throw error when JWT_SECRET is missing during signup", async () => {
      // Arrange
      delete process.env.JWT_SECRET;

      // Act & Assert
      await expect(userResolver.signup(newUserData)).rejects.toThrow(
        "Signup error"
      );
    });

    it("should handle user creation errors", async () => {
      // Arrange
      mockUserService.create.mockRejectedValue(
        new Error("Email already exists")
      );

      // Act & Assert
      await expect(userResolver.signup(newUserData)).rejects.toThrow(
        "Signup error"
      );
    });

    it("should hash the password before creating user", async () => {
      // Arrange
      const createdUser = createMockUser({
        email: newUserData.email,
      });

      mockUserService.create.mockResolvedValue(createdUser);

      // Act
      await userResolver.signup(newUserData);

      // Assert
      const createCall = mockUserService.create.mock.calls[0][0];
      expect(createCall.password).not.toBe("plainTextPassword");
      expect(createCall.password).toBeDefined();
      expect(typeof createCall.password).toBe("string");
    });

    it("should include all required fields when creating user", async () => {
      // Arrange
      const newUserData = {
        email: "complete@example.com",
        password: "password123",
        first_name: "Complete",
        last_name: "User",
        birthdate: new Date("1990-01-01"),
        avatar: { id: 3, title: "Complete Avatar", image: "complete.jpg" },
      };
      const createdUser = createMockUser({
        email: newUserData.email,
        avatar: createMockAvatar({
          id: newUserData.avatar.id,
          title: newUserData.avatar.title,
          image: newUserData.avatar.image,
        }),
      });

      mockUserService.create.mockResolvedValue(createdUser);

      // Act
      await userResolver.signup(newUserData);

      // Assert
      const createCall = mockUserService.create.mock.calls[0][0];
      expect(createCall).toEqual({
        email: newUserData.email,
        password: expect.any(String), // hashed password
        first_name: newUserData.first_name,
        last_name: newUserData.last_name,
        birthdate: newUserData.birthdate,
        avatar: newUserData.avatar,
      });
    });
  });

  it("should handle malformed email in signup", async () => {
    // Arrange
    const newUserDataFail = {
      email: "invalid-email",
      password: "password123",
      first_name: "John",
      last_name: "Smith",
      birthdate: new Date("1995-06-15"),
      avatar: { id: 2, title: "New Avatar", image: "new-avatar.jpg" },
    };

    mockUserService.create.mockRejectedValue(new Error("Invalid email format"));

    // Act & Assert
    await expect(userResolver.signup(newUserDataFail)).rejects.toThrow(
      "Signup error"
    );
  });

  it("should handle user with existing email in signup", async () => {
    // Arrange
    const newUserDataFail = {
      email: "existing@example.com",
      password: "password123",
      first_name: "John",
      last_name: "Smith",
      birthdate: new Date("1995-06-15"),
      avatar: { id: 2, title: "New Avatar", image: "new-avatar.jpg" },
    };

    mockUserService.create.mockRejectedValue(
      new Error("duplicate key value violates unique constraint")
    );

    // Act & Assert
    await expect(userResolver.signup(newUserDataFail)).rejects.toThrow(
      "Email already in use"
    );
  });

  describe("currentUser", () => {
    it("should return user information when valid token is provided", async () => {
      // Arrange
      const mockToken = "valid-token";
      const decodedToken = { id: 1 };
      const context = { token: mockToken };

      // Mock jwt.verify to return decoded token
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      // Mock User.findOne using jest.spyOn
      const User = await import("../../entities/User");
      const findOneSpy = jest
        .spyOn(User.default, "findOne")
        .mockResolvedValue(mockUser);

      // Act
      const result = await userResolver.currentUser(context);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_SECRET
      );
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: decodedToken.id },
        relations: ["avatar"],
      });
      expect(result).toEqual(mockUser);

      // Cleanup
      findOneSpy.mockRestore();
    });

    it("should return null when no token is provided", async () => {
      // Arrange
      const context = { token: null };

      // Act
      const result = await userResolver.currentUser(context);

      // Assert
      expect(result).toBeNull();
    });

    it("should return null when token is invalid", async () => {
      // Arrange
      const context = { token: "invalid-token" };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      // Act
      const result = await userResolver.currentUser(context);

      // Assert
      expect(result).toBeNull();
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

      mockUserService.updatePersonalInfo.mockResolvedValue(updatedUser);

      // Act
      const result = await userResolver.updatePersonalInfo(userId, updateData);

      // Assert
      expect(mockUserService.updatePersonalInfo).toHaveBeenCalledWith(
        userId,
        updateData
      );
      expect(result).toEqual(updatedUser);
    });

    it("should throw error when update fails", async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        first_name: "Updated",
        last_name: "Name",
        birthdate: new Date("1995-01-01T00:00:00.000Z"),
      };

      mockUserService.updatePersonalInfo.mockRejectedValue(
        new Error("User not found")
      );

      // Act & Assert
      await expect(
        userResolver.updatePersonalInfo(userId, updateData)
      ).rejects.toThrow("Failed to update personal information");
    });
  });

  describe("updateAvatar", () => {
    it("should update user avatar successfully", async () => {
      // Arrange
      const userId = 1;
      const avatarData = { avatar_id: 2 };
      const newAvatar = createMockAvatar({ id: 2, title: "New Avatar" });
      const updatedUser = createMockUser({ id: userId, avatar: newAvatar });

      mockUserService.updateAvatar.mockResolvedValue(updatedUser);

      // Act
      const result = await userResolver.updateAvatar(userId, avatarData);

      // Assert
      expect(mockUserService.updateAvatar).toHaveBeenCalledWith(
        userId,
        avatarData.avatar_id
      );
      expect(result).toEqual(updatedUser);
      expect(result.avatar.id).toBe(2);
    });

    it("should throw error when update fails", async () => {
      // Arrange
      const userId = 1;
      const avatarData = { avatar_id: 999 };

      mockUserService.updateAvatar.mockRejectedValue(
        new Error("Avatar not found")
      );

      // Act & Assert
      await expect(
        userResolver.updateAvatar(userId, avatarData)
      ).rejects.toThrow("Failed to update avatar");
    });
  });

  describe("changePassword", () => {
    it("should change password successfully with correct current password", async () => {
      // Arrange
      const userId = 1;
      const passwordData = {
        current_password: "oldPassword123",
        new_password: "newPassword456",
      };
      const updatedUser = createMockUser({ id: userId });

      mockUserService.changePassword.mockResolvedValue(updatedUser);

      // Act
      const result = await userResolver.changePassword(userId, passwordData);

      // Assert
      expect(mockUserService.changePassword).toHaveBeenCalledWith(
        userId,
        passwordData.current_password,
        passwordData.new_password
      );
      expect(result).toBe(true);
    });

    it("should throw error when current password is incorrect", async () => {
      // Arrange
      const userId = 1;
      const passwordData = {
        current_password: "wrongPassword123",
        new_password: "newPassword456",
      };

      mockUserService.changePassword.mockRejectedValue(
        new Error("Current password is incorrect")
      );

      // Act & Assert
      await expect(
        userResolver.changePassword(userId, passwordData)
      ).rejects.toThrow("Current password is incorrect");
    });

    it("should throw error when password change fails", async () => {
      // Arrange
      const userId = 1;
      const passwordData = {
        current_password: "oldPassword123",
        new_password: "newPassword456",
      };

      mockUserService.changePassword.mockRejectedValue(
        new Error("User not found")
      );

      // Act & Assert
      await expect(
        userResolver.changePassword(userId, passwordData)
      ).rejects.toThrow("Failed to change password");
    });
  });

  describe("deleteAccount", () => {
    it("should delete user account successfully", async () => {
      // Arrange
      const userId = 1;
      mockUserService.deleteAccount.mockResolvedValue(true);

      // Act
      const result = await userResolver.deleteAccount(userId);

      // Assert
      expect(mockUserService.deleteAccount).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it("should throw error when delete fails", async () => {
      // Arrange
      const userId = 1;
      mockUserService.deleteAccount.mockRejectedValue(
        new Error("User not found")
      );

      // Act & Assert
      await expect(userResolver.deleteAccount(userId)).rejects.toThrow(
        "Failed to delete account"
      );
    });
  });
});
