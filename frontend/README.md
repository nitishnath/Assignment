# Trip Planner Frontend

This is the frontend website for the Trip Planner application. It's built with Next.js and provides a user-friendly interface for managing travel trips.

## What This Does

- Displays a dashboard with all of user's trips
- Lets user create new trip plans
- Allows user to edit existing trips
- Provides searching and pagination options
- Shows trip details like destination, duration, and budget

## How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Website
```bash
npm run dev
```

### Step 3: Open in Browser
Go to `http://localhost:3000` in your web browser

**Important:** Make sure the backend server is also running on port 3001, or the website won't be able to load trip data.

## Available Commands

- `npm run dev` - Start the development server (auto-refreshes when you make changes)
- `npm run build` - Build the website for production
- `npm start` - Start the production server
- `npm run lint` - Check code for errors

## Pages Available

- `/` - Homepage (redirects to dashboard)
- `/dashboard` - View all your trips
- `/submit` - Create a new trip
- `/edit/[id]` - Edit an existing trip

## Environment Setup

The frontend is already configured to connect to the backend at `http://localhost:3001`. If you need to change this:

1. Create a `.env.local` file
2. Add: `NEXT_PUBLIC_API_URL=http://your-backend-url`

## Troubleshooting

**Website shows "Failed to load trips":**
- Make sure the backend server is running on port 3001
- Check that both servers are started

**Port 3000 already in use:**
- Stop any other programs using port 3000
- Or the system will automatically suggest a different port

**Page won't load:**
- Make sure you ran `npm install`
- Check that Node.js is installed (version 18 or higher)
- Try refreshing the browser
