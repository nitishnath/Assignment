import Fastify, { FastifyInstance } from 'fastify';
import { tripRoutes } from '../routes/trips';
import { Trip } from '../models/Trip';

// Mock the Trip model completely
jest.mock('../models/Trip', () => {
  const mockTrips = [
    {
      _id: '507f1f77bcf86cd799439011',
      title: 'Paris Adventure',
      destination: 'Paris, France',
      days: 7,
      budget: 150000,
      createdAt: new Date('2024-01-15T10:30:00.000Z')
    },
    {
      _id: '507f1f77bcf86cd799439012',
      title: 'Tokyo Experience',
      destination: 'Tokyo, Japan',
      days: 10,
      budget: 200000,
      createdAt: new Date('2024-01-16T10:30:00.000Z')
    },
    {
      _id: '507f1f77bcf86cd799439013',
      title: 'New York City',
      destination: 'New York, USA',
      days: 5,
      budget: 120000,
      createdAt: new Date('2024-01-17T10:30:00.000Z')
    }
  ];

  return {
    Trip: {
      find: jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrips)
      })),
      countDocuments: jest.fn().mockResolvedValue(mockTrips.length)
    }
  };
});

// Mock database connection functions
jest.mock('../config/database', () => ({
  connectDatabase: jest.fn(),
  disconnectDatabase: jest.fn(),
}));

describe('GET /api/trips', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // Create Fastify instance
    app = Fastify({ logger: false });
    
    // Register routes
    await app.register(tripRoutes);
  });

  afterAll(async () => {
    // Close Fastify instance
    await app.close();
  });

  it('should return all trips with default pagination', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trips'
    });

    expect(response.statusCode).toBe(200);
    
    const data = JSON.parse(response.payload);
    expect(data).toHaveProperty('trips');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page', 1);
    expect(data).toHaveProperty('limit', 10);
    expect(data).toHaveProperty('totalPages');
    expect(Array.isArray(data.trips)).toBe(true);
  });

  it('should handle search query parameter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trips?search=Paris'
    });

    expect(response.statusCode).toBe(200);
    
    const data = JSON.parse(response.payload);
    expect(data).toHaveProperty('trips');
    expect(Array.isArray(data.trips)).toBe(true);
  });

  it('should handle pagination parameters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trips?page=1&limit=5'
    });

    expect(response.statusCode).toBe(200);
    
    const data = JSON.parse(response.payload);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(5);
  });

  it('should handle budget filter parameters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trips?minBudget=100000&maxBudget=200000'
    });

    expect(response.statusCode).toBe(200);
    
    const data = JSON.parse(response.payload);
    expect(data).toHaveProperty('trips');
  });

  it('should handle invalid query parameters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trips?page=invalid&limit=notanumber'
    });

    expect(response.statusCode).toBe(200);
    
    const data = JSON.parse(response.payload);
    // Invalid values result in null when serialized to JSON
    expect(data.page).toBeNull();
    expect(data.limit).toBeNull();
    expect(data).toHaveProperty('trips');
  });
});