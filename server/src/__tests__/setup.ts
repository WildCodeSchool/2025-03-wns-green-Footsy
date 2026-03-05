import { jest } from '@jest/globals';

// Mock JWT for testing
process.env.JWT_SECRET = 'test-jwt-secret';

// timeout
jest.setTimeout(10000);

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 