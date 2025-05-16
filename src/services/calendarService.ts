import axios from 'axios';
import { CalendarEvent } from '../types/CalendarEvent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for demo purposes
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2023, 10, 22, 10, 0),
    end: new Date(2023, 10, 22, 11, 0),
    allDay: false,
    taskId: '2'
  },
  {
    id: '2',
    title: 'Project Deadline',
    start: new Date(2023, 10, 25, 0, 0),
    end: new Date(2023, 10, 25, 23, 59),
    allDay: true,
    taskId: '1'
  },
  {
    id: '3',
    title: 'Research Time',
    start: new Date(2023, 10, 30, 13, 0),
    end: new Date(2023, 10, 30, 15, 0),
    allDay: false,
    taskId: '3'
  }
];

export const getEvents = async (start: Date, end: Date): Promise<CalendarEvent[]> => {
  try {
    // For demo purposes, return mock data
    return mockEvents.filter(event => 
      event.start >= start && event.end <= end
    );
    
    // Real implementation:
    // const response = await axiosInstance.get('/calendar/events', {
    //   params: { start: start.toISOString(), end: end.toISOString() }
    // });
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch events');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  try {
    // For demo purposes, create with mock data
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockEvents.push(newEvent);
    return newEvent;
    
    // Real implementation:
    // const response = await axiosInstance.post('/calendar/events', event);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create event');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updateEvent = async (id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  try {
    // For demo purposes, update in mock data
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...event };
    return mockEvents[eventIndex];
    
    // Real implementation:
    // const response = await axiosInstance.put(`/calendar/events/${id}`, event);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update event');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    // For demo purposes, delete from mock data
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    mockEvents.splice(eventIndex, 1);
    
    // Real implementation:
    // await axiosInstance.delete(`/calendar/events/${id}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete event');
    }
    throw new Error('Network error. Please try again later.');
  }
};