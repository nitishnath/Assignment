import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripplanner';

// This connectDatabase function will be used in the server setup
export const connectDatabase = async (): Promise<boolean> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error instanceof Error ? error.message : error);
    return false;
  }
};

// This disconnectDatabase function will be used in the server shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};