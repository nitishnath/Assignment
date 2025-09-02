'use client';

import { useState } from 'react';
import { CreateTripRequest, TripResponse } from '@/types/trip';

//This interface is used to define the props for TripFormProps component
interface TripFormProps {
  initialData?: TripResponse;
  onSubmit: (data: CreateTripRequest) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
}

// This component is used to display trip form
export default function TripForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  submitButtonText = 'Submit' 
}: TripFormProps) {
  //This state is used to store the form data
  const [formData, setFormData] = useState<CreateTripRequest>({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    days: initialData?.days || 1,
    budget: initialData?.budget || 0,
  });
  //This state is used to store the errors
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTripRequest, string>>>({});

  //This function is used to validate the form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTripRequest, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.days < 1) {
      newErrors.days = 'Days must be at least 1';
    }

    if (formData.budget < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //This function is used to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  //This function is used to handle input change
  const handleInputChange = (field: keyof CreateTripRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    const hasValidData = formData.title.trim() !== '' && 
                        formData.destination.trim() !== '' && 
                        formData.days >= 1 && 
                        formData.budget >= 0;
    
    // If this is an update (initialData exists), check if data has changed
    if (initialData) {
      const hasChanges = formData.title !== initialData.title ||
                        formData.destination !== initialData.destination ||
                        formData.days !== initialData.days ||
                        formData.budget !== initialData.budget;
      
      return hasValidData && hasChanges;
    }
    
    // For new trips, enable button only if form is valid
    return hasValidData;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Trip Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter trip title"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
          Destination
        </label>
        <input
          type="text"
          id="destination"
          value={formData.destination}
          onChange={(e) => handleInputChange('destination', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
            errors.destination ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter destination"
          disabled={isLoading}
        />
        {errors.destination && (
          <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
        )}
      </div>

      <div>
        <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Days
        </label>
        <input
          type="number"
          id="days"
          min="1"
          value={formData.days}
          onChange={(e) => handleInputChange('days', parseInt(e.target.value) || 1)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
            errors.days ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.days && (
          <p className="mt-1 text-sm text-red-600">{errors.days}</p>
        )}
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          Budget (₹)
        </label>
        <input
          type="number"
          id="budget"
          min="0"
          step="0.01"
          value={formData.budget}
          onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
            errors.budget ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter budget"
          disabled={isLoading}
        />
        {errors.budget && (
          <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !isFormValid()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isLoading ? 'Submitting...' : submitButtonText}
      </button>
    </form>
  );
}