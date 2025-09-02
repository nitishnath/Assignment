# Trip Planner Application

A full-stack web application for planning and managing travel trips. Built with Next.js (frontend) and Fastify (backend) with MongoDB for data storage.

## Features

- **Trip Planning**: Create detailed trip plans with destinations, duration, and budget
- **Trip Management**: View, edit, and organize all your trips in one place
- **Search & Filter**: Find trips by destination, budget range, or other criteria
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - Schema validation

### Backend
- **Fastify** - Fast and efficient web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Zod** - Schema validation

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## How to Run the Project

### Quick Start (3 Simple Steps)

**Step 1: Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Step 2: Set Up Environment Files**
```bash
# Copy backend environment file
cd ../backend
cp .env.example .env

# The .env file is already configured with a working MongoDB connection
# No changes needed unless you want to use your own database
```

**Step 3: Start Both Servers**

Open two terminal windows:

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

**That's it!** Open your browser and go to `http://localhost:3000`

### What Each Server Does
- **Backend** (port 3001): Handles data and API requests
- **Frontend** (port 3000): The website you see and interact with

### If Something Goes Wrong
- Make sure both servers are running
- Check that no other programs are using ports 3000 or 3001
- The database connection is already set up and working

### Adding Sample Data (Optional)

To add sample trips to test the application:
```bash
cd backend
npm run seed
```
This will add 20 sample trips to your database for testing.

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## API Endpoints

### Trips

- `GET /api/trips` - Get all trips with optional search and filters
  - Query parameters: `search`, `destination`, `minBudget`, `maxBudget`, `page`, `limit`
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get a specific trip by ID
- `PUT /api/trips/:id` - Update a trip by ID

### Health Check

- `GET /health` - Server health check

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/trip-planner
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Data Models

### Trip Plan

```typescript
interface TripPlan {
  title: string;        // Trip title
  destination: string;  // Destination location
  days: number;        // Duration in days
  budget: number;      // Budget amount
  createdAt: Date;     // Creation timestamp
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network connectivity for MongoDB Atlas

**Port Already in Use:**
- Change the PORT in backend `.env` file
- Update NEXT_PUBLIC_API_URL in frontend `.env.local`

**CORS Issues:**
- Verify FRONTEND_URL in backend `.env` matches your frontend URL
- Check that CORS is properly configured in the backend
  
