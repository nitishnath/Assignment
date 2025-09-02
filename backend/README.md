# Trip Planner Backend

This is the backend API server for the Trip Planner application. It handles all data operations and provides REST API endpoints for the frontend.

## What This Does

- Stores and manages trip data in MongoDB
- Provides API endpoints for creating, reading, updating trips
- Handles search and pagination of trips
- Manages database connections and data validation

## How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
# Copy the environment file
cp .env.example .env

# The .env file is already configured with a working database
# No changes needed unless you want to use your own MongoDB
```

### Step 3: Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Commands

- `npm run dev` - Start the development server (auto-restarts when you make changes)
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run seed` - Add sample trip data to the database

## API Endpoints

Once the server is running, you can use these endpoints:

- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get a specific trip
- `PUT /api/trips/:id` - Update a trip
- `GET /health` - Check if the server is working

## Environment Variables

The `.env` file contains:
- `MONGODB_URI` - Database connection (already configured)
- `PORT` - Server port (3001)
- `FRONTEND_URL` - Frontend URL for CORS (http://localhost:3000)

## Troubleshooting

**Port 3001 already in use:**
- Stop any other programs using port 3001
- Or change the PORT in the `.env` file

**Database connection issues:**
- The default database is already set up and working
- Check your internet connection

**Server won't start:**
- Make sure you ran `npm install`
- Check that Node.js is installed (version 18 or higher)