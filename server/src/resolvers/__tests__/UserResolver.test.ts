import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as jwt from "jsonwebtoken";
import UserResolver from '../UserResolver';
import type { UserServiceInterface } from '../../services/UserService';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// Mock UserService
const mockUserService: jest.Mocked<UserServiceInterface> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  authenticateUser: jest.fn(),
};

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let mockUser: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    birthdate: Date;
    avatar: any;
  };

  beforeEach(() => {
    // Reset environment
    process.env.JWT_SECRET = 'test-secret-key';
    
    // Create resolver with mocked service
    userResolver = new UserResolver(mockUserService);
    
    // Mock user data
    mockUser = {
      id: 1,
      email: 'test@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      birthdate: new Date('1990-08-04'),
      avatar: { id: 1, url: 'avatar.jpg' },
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return token and user data with valid credentials', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'validPassword123',
      };
      const mockToken = 'mock-jwt-token';
      
      mockUserService.authenticateUser.mockResolvedValue(mockUser as any);
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
      expect(result).toContain('token=mock-jwt-token');
      expect(result).toContain('"id":1');
      expect(result).toContain('"firstName":"Jane"');
    });

    it('should throw "Login error" when JWT_SECRET is missing', async () => {
      // Arrange
      delete process.env.JWT_SECRET;
      const userData = {
        email: 'test@example.com',
        password: 'validPassword123',
      };

      // Act & Assert
      await expect(userResolver.login(userData))
        .rejects
        .toThrow('Login error');
    });

    it('should throw "Login error" when user is not found', async () => {
      // Arrange
      const userData = {
        email: 'nonexistent@example.com',
        password: 'anyPassword123',
      };
      
      mockUserService.authenticateUser.mockRejectedValue(new Error('User not found'));

      // Act & Assert
      await expect(userResolver.login(userData))
        .rejects
        .toThrow('Login error');
    });

    it('should throw "Login error" when password is invalid', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'wrongPassword123',
      };
      
      mockUserService.authenticateUser.mockRejectedValue(new Error('Invalid password'));

      // Act & Assert
      await expect(userResolver.login(userData))
        .rejects
        .toThrow('Login error');
    });

    it('should throw "Login error" when JWT signing fails', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'validPassword123',
      };
      
      mockUserService.authenticateUser.mockResolvedValue(mockUser as any);
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      // Act & Assert
      await expect(userResolver.login(userData))
        .rejects
        .toThrow('Login error');
    });

    it('should throw "Login error" when user is null', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'validPassword123',
      };
      
      mockUserService.authenticateUser.mockResolvedValue(null as any);

      // Act & Assert
      await expect(userResolver.login(userData))
        .rejects
        .toThrow('Login error');
    });
  });
});
