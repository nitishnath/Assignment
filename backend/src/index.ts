import Fastify from 'fastify';
import cors from '@fastify/cors';
import { connectDatabase, disconnectDatabase } from './config/database';
import { tripRoutes } from './routes/trips';
import dotenv from 'dotenv';

dotenv.config();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process for database connection issues
});

const fastify = Fastify({
  logger: true
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Global database connection status
let isDatabaseConnected = false;

// Register CORS plugin with comprehensive configuration
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
});

// Register routes
fastify.register(tripRoutes);

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: {
      connected: isDatabaseConnected,
      status: isDatabaseConnected ? 'Connected' : 'Disconnected'
    }
  };
});

// Start server
const start = async () => {
  // Connect to database
  isDatabaseConnected = await connectDatabase();
  
  try {
    // Start the server
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    console.log(`📊 Database status: ${isDatabaseConnected ? '✅ Connected' : '❌ Disconnected'}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await disconnectDatabase();
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await disconnectDatabase();
  await fastify.close();
  process.exit(0);
});

start();