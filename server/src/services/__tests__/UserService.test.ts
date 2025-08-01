import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

jest.mock('../../entities/User', () => ({
  findOne: jest.fn(),
}));

describe('UserService', () => {
  let userService;
  let mockUser;
  let argon2;
  let User;

  beforeEach(async () => {

    const UserServiceModule = await import('../UserService');
    const UserModule = await import('../../entities/User');
    const argon2Module = await import('argon2');
    
    userService = new UserServiceModule.default();
    User = UserModule.default;
    argon2 = argon2Module;
    

    mockUser = {
      id: 1,
      email: 'test@example.com',
      hashed_password: 'hashedPassword123',
      first_name: 'Jane',
      last_name: 'Doe',
      birthdate: new Date('1990-08-04'),
    };

    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should successfully authenticate user with valid credentials', async () => {
      
      const email = 'test@example.com';
      const password = 'validPassword123';
      
      // Mock the database call
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock the password verification
      argon2.verify.mockResolvedValue(true);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ['avatar']
      });
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.hashed_password, password);
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user is not found', async () => {
      
      const email = 'nonexistent@example.com';
      const password = 'anyPassword123';
      
      // Mock the database call to return null
      User.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.authenticateUser(email, password))
        .rejects
        .toThrow('User not found');

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ['avatar']
      });
    });

    it('should throw error when password is invalid', async () => {
      
      const email = 'test@example.com';
      const password = 'wrongPassword123';
      
      
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock the password verification to return false
      argon2.verify.mockResolvedValue(false);

      // Act & Assert
      await expect(userService.authenticateUser(email, password))
        .rejects
        .toThrow('Invalid password');

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ['avatar']
      });
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.hashed_password, password);
    });
  });
}); 