import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { login, parseLoginResponse, saveToken, getToken, removeToken } from '../authService';


interface GraphQLResponse {
  data?: {
    login: string;
  };
  errors?: Array<{ message: string }>;
}

// Mock fetch globally
const mockFetch = vi.fn() as MockedFunction<typeof fetch>;
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn() as MockedFunction<Storage['getItem']>,
  setItem: vi.fn() as MockedFunction<Storage['setItem']>,
  removeItem: vi.fn() as MockedFunction<Storage['removeItem']>,
  clear: vi.fn() as MockedFunction<Storage['clear']>,
};

// Override global localStorage with mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    localStorage.clear();
  });

  describe('parseLoginResponse', () => {
    it('should parse valid login response correctly', () => {
      const mockResponse = '{"id":1,"firstName":"John","lastName":"Doe","mail":"john@example.com"}; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      
      const result = parseLoginResponse(mockResponse);
      
      expect(result).toEqual({
        user: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          mail: "john@example.com"
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      });
    });

    it('should throw error for invalid response format', () => {
      const invalidResponse = 'invalid-format';
      
      expect(() => parseLoginResponse(invalidResponse)).toThrow('Failed to parse login response');
    });

    it('should throw error for malformed JSON', () => {
      const malformedResponse = 'invalid-json; token=some-token';
      
      expect(() => parseLoginResponse(malformedResponse)).toThrow('Failed to parse login response');
    });
  });

  describe('token management', () => {
    it('should save and retrieve token from localStorage', () => {
      const testToken = 'test-token-123';
      
      saveToken(testToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', testToken);
      
      localStorageMock.getItem.mockReturnValue(testToken);
      const retrievedToken = getToken();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      expect(retrievedToken).toBe(testToken);
    });

    it('should remove token from localStorage', () => {
      const testToken = 'test-token-123';
      
      localStorageMock.getItem.mockReturnValue(testToken);
      expect(getToken()).toBe(testToken);
      
      removeToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(getToken()).toBeNull();
    });
  });

  describe('login function', () => {
    it('should make successful login request', async () => {
      const mockResponse: GraphQLResponse = {
        data: {
          login: '{"id":1,"firstName":"John","lastName":"Doe","mail":"john@example.com"}; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await login('john@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5050/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
          mutation Login($data: UserInput!) {
            login(data: $data)
          }
        `,
          variables: {
            data: {
              email: 'john@example.com',
              password: 'password123',
            },
          },
        }),
      });

      expect(result).toBe(mockResponse.data?.login);
    });

    it('should throw error when login fails', async () => {
      const mockError: GraphQLResponse = {
        errors: [{ message: 'Invalid credentials' }]
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockError),
      } as Response);

      await expect(login('invalid@example.com', 'wrongpassword')).rejects.toThrow('Login failed');
    });

    it('should throw error when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(login('john@example.com', 'password123')).rejects.toThrow('Network error');
    });
  });

  describe('integration test', () => {
    it('should complete full login flow', async () => {
      const mockResponse: GraphQLResponse = {
        data: {
          login: '{"id":1,"firstName":"John","lastName":"Doe","mail":"john@example.com"}; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      } as Response);

      // Test the full flow
      const loginResult = await login('john@example.com', 'password123');
      const { user, token } = parseLoginResponse(loginResult);
      
      saveToken(token);

      // Verify everything worked
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.mail).toBe('john@example.com');
      
      // Mock the getItem to return the token saved
      localStorageMock.getItem.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      expect(getToken()).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    });
  });
});
