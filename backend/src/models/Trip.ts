import mongoose, { Schema, Document } from 'mongoose';
import { TripPlan } from '../types/trip';

export interface TripDocument extends TripPlan, Document {}

const TripSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for search functionality
TripSchema.index({ destination: 'text', title: 'text' });

export const Trip = mongoose.model<TripDocument>('Trip', TripSchema);