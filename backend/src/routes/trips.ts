import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Trip } from '../models/Trip';
import { TripPlanSchema, TripResponse, TripsListResponse } from '../types/trip';
import { z } from 'zod';

// Query parameters schema for GET /trips
const TripsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  destination: z.string().optional(),
  minBudget: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxBudget: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  search: z.string().optional()
});

export async function tripRoutes(fastify: FastifyInstance) {
  // POST /api/trips - Create new trip
  fastify.post('/api/trips', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validatedData = TripPlanSchema.parse(request.body);
      
      const trip = new Trip(validatedData);
      const savedTrip = await trip.save();
    
      // Convert ObjectId to string
      const response: TripResponse = {
        _id: (savedTrip._id as any).toString(),
        title: savedTrip.title,
        destination: savedTrip.destination,
        days: savedTrip.days,
        budget: savedTrip.budget,
        createdAt: savedTrip.createdAt.toISOString()
      };
      
      reply.status(201).send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: 'Validation failed', details: error.issues });
      } else {
        console.error('Error creating trip:', error);
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  });

  // GET /api/trips - Get all trips with search, filter, and pagination
  fastify.get('/api/trips', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = TripsQuerySchema.parse(request.query);
      const { page, limit, destination, search } = query;
      
      // Build MongoDB filter
      const filter: any = {};
      
      if (destination) {
        filter.destination = { $regex: destination, $options: 'i' };
      }
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { destination: { $regex: search, $options: 'i' } }
        ];
      }
      
      const skip = (page - 1) * limit;
      
      // Execute the query
      const [trips, total] = await Promise.all([
        Trip.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Trip.countDocuments(filter)
      ]);
      
      // Convert ObjectId to string
      const tripResponses: TripResponse[] = trips.map(trip => ({
        _id: (trip._id as any).toString(),
        title: trip.title,
        destination: trip.destination,
        days: trip.days,
        budget: trip.budget,
        createdAt: trip.createdAt.toISOString()
      }));
      
      // Construct response
      const response: TripsListResponse = {
        trips: tripResponses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
      
      reply.send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: 'Invalid query parameters', details: error.issues });
      } else {
        console.error('Error fetching trips:', error);
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  });

  // PUT /api/trips/:id - Update trip by ID
  fastify.put('/api/trips/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const validatedData = TripPlanSchema.partial().parse(request.body);
      
      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        validatedData,
        { new: true, runValidators: true }
      );
      
      if (!updatedTrip) {
        reply.status(404).send({ error: 'Trip not found' });
        return;
      }
      
      const response: TripResponse = {
        _id: (updatedTrip._id as any).toString(),
        title: updatedTrip.title,
        destination: updatedTrip.destination,
        days: updatedTrip.days,
        budget: updatedTrip.budget,
        createdAt: updatedTrip.createdAt.toISOString()
      };
      
      reply.send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: 'Validation failed', details: error.issues });
      } else {
        console.error('Error updating trip:', error);
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  });

  // GET /api/trips/:id - Get trip by ID
  fastify.get('/api/trips/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const trip = await Trip.findById(id);
      
      if (!trip) {
        reply.status(404).send({ error: 'Trip not found' });
        return;
      }
      
      // Convert ObjectId to string
      const response: TripResponse = {
        _id: (trip._id as any).toString(),
        title: trip.title,
        destination: trip.destination,
        days: trip.days,
        budget: trip.budget,
        createdAt: trip.createdAt.toISOString()
      };
      
      reply.send(response);
    } catch (error) {
      console.error('Error fetching trip:', error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
}