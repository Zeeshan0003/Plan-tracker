import axios from 'axios';
import { Goal } from '../types/Goal';

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
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Complete Project X',
    description: 'Finish all tasks related to Project X by the end of the month',
    targetDate: new Date(2023, 11, 31),
    progress: 65
  },
  {
    id: '2',
    title: 'Learn New Technology',
    description: 'Master React and TypeScript for frontend development',
    targetDate: new Date(2023, 11, 15),
    progress: 40
  }
];

export const getGoals = async (): Promise<Goal[]> => {
  try {
    // For demo purposes, return mock data
    return mockGoals;
    
    // Real implementation:
    // const response = await axiosInstance.get('/goals');
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch goals');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const getGoal = async (id: string): Promise<Goal> => {
  try {
    // For demo purposes, find in mock data
    const goal = mockGoals.find(goal => goal.id === id);
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
    
    // Real implementation:
    // const response = await axiosInstance.get(`/goals/${id}`);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch goal');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const createGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  try {
    // For demo purposes, create with mock data
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockGoals.push(newGoal);
    return newGoal;
    
    // Real implementation:
    // const response = await axiosInstance.post('/goals', goal);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create goal');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updateGoal = async (id: string, goal: Partial<Goal>): Promise<Goal> => {
  try {
    // For demo purposes, update in mock data
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    
    mockGoals[goalIndex] = { ...mockGoals[goalIndex], ...goal };
    return mockGoals[goalIndex];
    
    // Real implementation:
    // const response = await axiosInstance.put(`/goals/${id}`, goal);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update goal');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const deleteGoal = async (id: string): Promise<void> => {
  try {
    // For demo purposes, delete from mock data
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    
    mockGoals.splice(goalIndex, 1);
    
    // Real implementation:
    // await axiosInstance.delete(`/goals/${id}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete goal');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const calculateGoalProgress = async (goalId: string): Promise<number> => {
  try {
    // For demo purposes, calculate progress based on mock data
    const goal = mockGoals.find(g => g.id === goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    
    // In a real app, this would calculate based on completed tasks
    return goal.progress;
    
    // Real implementation:
    // const response = await axiosInstance.get(`/goals/${goalId}/progress`);
    // return response.data.progress;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to calculate goal progress');
    }
    throw new Error('Network error. Please try again later.');
  }
};