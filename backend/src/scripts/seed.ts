import mongoose from 'mongoose';
import { Trip } from '../models/Trip';
import { connectDatabase } from '../config/database';

const sampleTrips = [
  {
    title: "Paris City Break",
    destination: "Paris, France",
    days: 5,
    budget: 75000
  },
  {
    title: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    days: 8,
    budget: 120000
  },
  {
    title: "Bali Paradise",
    destination: "Bali, Indonesia",
    days: 7,
    budget: 65000
  },
  {
    title: "Swiss Alps Trek",
    destination: "Interlaken, Switzerland",
    days: 10,
    budget: 150000
  },
  {
    title: "Dubai Luxury",
    destination: "Dubai, UAE",
    days: 6,
    budget: 95000
  },
  {
    title: "Goa Beach Vacation",
    destination: "Goa, India",
    days: 5,
    budget: 25000
  },
  {
    title: "Kerala Backwaters",
    destination: "Alleppey, Kerala",
    days: 6,
    budget: 35000
  },
  {
    title: "Rajasthan Heritage",
    destination: "Jaipur, Rajasthan",
    days: 8,
    budget: 55000
  },
  {
    title: "Himalayan Trek",
    destination: "Manali, Himachal Pradesh",
    days: 12,
    budget: 45000
  },
  {
    title: "New York City",
    destination: "New York, USA",
    days: 7,
    budget: 180000
  },
  {
    title: "London Explorer",
    destination: "London, UK",
    days: 6,
    budget: 110000
  },
  {
    title: "Rome Historical",
    destination: "Rome, Italy",
    days: 5,
    budget: 70000
  },
  {
    title: "Barcelona Culture",
    destination: "Barcelona, Spain",
    days: 6,
    budget: 80000
  },
  {
    title: "Amsterdam Canals",
    destination: "Amsterdam, Netherlands",
    days: 4,
    budget: 60000
  },
  {
    title: "Singapore Modern",
    destination: "Singapore",
    days: 5,
    budget: 85000
  },
  {
    title: "Thailand Islands",
    destination: "Phuket, Thailand",
    days: 9,
    budget: 55000
  },
  {
    title: "Australia Outback",
    destination: "Sydney, Australia",
    days: 14,
    budget: 200000
  },
  {
    title: "Iceland Northern Lights",
    destination: "Reykjavik, Iceland",
    days: 7,
    budget: 130000
  },
  {
    title: "Morocco Desert",
    destination: "Marrakech, Morocco",
    days: 8,
    budget: 65000
  },
  {
    title: "South Korea Culture",
    destination: "Seoul, South Korea",
    days: 6,
    budget: 90000
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Connect to database
    const isConnected = await connectDatabase();
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Connected to database');
    
    // Insert sample trips
    const insertedTrips = await Trip.insertMany(sampleTrips);
    console.log(`Successfully seeded ${insertedTrips.length} trips`);
    
    
    console.log('\nDatabase seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };