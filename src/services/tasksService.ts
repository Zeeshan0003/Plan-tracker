import axios from 'axios';
import { Task, TaskPriority, TaskStatus } from '../types/Task';

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

// Mock data for demo purposes - now with tasks for different users
let mockTasks: Task[] = [];

// Initialize mockTasks from localStorage if available
try {
  const storedTasks = localStorage.getItem('mockTasks');
  if (storedTasks) {
    mockTasks = JSON.parse(storedTasks).map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt)
    }));
  } else {
    // Initial mock data if nothing in localStorage
    mockTasks = [
      {
        id: '1',
        userId: 'user1',
        title: 'Complete project proposal',
        description: 'Finish the draft and send for review',
        dueDate: new Date(2023, 10, 25),
        priority: TaskPriority.High,
        status: TaskStatus.InProgress,
        completed: false,
        goalId: '1',
        createdAt: new Date(2023, 10, 20),
        updatedAt: new Date(2023, 10, 20),
        estimatedHours: 4,
        progress: 50
      },
      {
        id: '2',
        userId: 'user2',
        title: 'Weekly team meeting',
        description: 'Discuss project progress and blockers',
        dueDate: new Date(2023, 10, 22),
        priority: TaskPriority.Medium,
        status: TaskStatus.Completed,
        completed: true,
        goalId: '1',
        createdAt: new Date(2023, 10, 15),
        updatedAt: new Date(2023, 10, 22),
        estimatedHours: 1,
        actualHours: 1,
        progress: 100
      },
      {
        id: '3',
        userId: 'user3',
        title: 'Research new technologies',
        description: 'Look into new frameworks for the upcoming project',
        dueDate: new Date(2023, 10, 30),
        priority: TaskPriority.Low,
        status: TaskStatus.NotStarted,
        completed: false,
        goalId: '2',
        createdAt: new Date(2023, 10, 25),
        updatedAt: new Date(2023, 10, 25),
        estimatedHours: 8,
        progress: 0
      }
    ];
    // Save initial data to localStorage
    localStorage.setItem('mockTasks', JSON.stringify(mockTasks));
  }
} catch (error) {
  console.error('Error initializing mock tasks:', error);
  mockTasks = [];
}

// Helper function to save tasks to localStorage
const saveTasksToStorage = () => {
  try {
    localStorage.setItem('mockTasks', JSON.stringify(mockTasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

export const getTasks = async (userId?: string): Promise<Task[]> => {
  try {
    // Always require userId to ensure we only return tasks for the specific user
    if (!userId) {
      throw new Error('User ID is required to fetch tasks');
    }
    
    // Filter tasks for the specific user
    return mockTasks.filter(task => task.userId === userId);
    
    // Real implementation:
    // const response = await axiosInstance.get('/tasks', {
    //   params: { userId }
    // });
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch tasks');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const getTask = async (id: string): Promise<Task> => {
  try {
    // For demo purposes, find in mock data
    const task = mockTasks.find(task => task.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
    
    // Real implementation:
    // const response = await axiosInstance.get(`/tasks/${id}`);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch task');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  try {
    // Validate that userId is provided
    if (!task.userId) {
      throw new Error('User ID is required to create a task');
    }

    // For demo purposes, create with mock data
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: task.status || TaskStatus.NotStarted,
      progress: task.progress || 0
    };

    // Ensure the task is associated with the correct user
    newTask.userId = task.userId;
    
    mockTasks.push(newTask);
    saveTasksToStorage(); // Save to localStorage after adding new task
    return newTask;
    
    // Real implementation:
    // const response = await axiosInstance.post('/tasks', task);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create task');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  try {
    // For demo purposes, update in mock data
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...task,
      updatedAt: new Date()
    };
    mockTasks[taskIndex] = updatedTask;
    saveTasksToStorage(); // Save to localStorage after updating task
    return updatedTask;
    
    // Real implementation:
    // const response = await axiosInstance.put(`/tasks/${id}`, task);
    // return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update task');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    // For demo purposes, delete from mock data
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    saveTasksToStorage(); // Save to localStorage after deleting task
    
    // Real implementation:
    // await axiosInstance.delete(`/tasks/${id}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete task');
    }
    throw new Error('Network error. Please try again later.');
  }
};

// New function to get task statistics for a user
export const getUserTaskStats = async (userId: string): Promise<{
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  onHoldTasks: number;
  averageProgress: number;
}> => {
  try {
    const userTasks = await getTasks(userId);
    
    return {
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === TaskStatus.Completed).length,
      inProgressTasks: userTasks.filter(t => t.status === TaskStatus.InProgress).length,
      notStartedTasks: userTasks.filter(t => t.status === TaskStatus.NotStarted).length,
      onHoldTasks: userTasks.filter(t => t.status === TaskStatus.OnHold).length,
      averageProgress: userTasks.reduce((acc, task) => acc + (task.progress || 0), 0) / userTasks.length
    };
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch task statistics');
    }
    throw new Error('Network error. Please try again later.');
  }
};