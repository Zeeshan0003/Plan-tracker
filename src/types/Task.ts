export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum TaskRecurrence {
  None = 'None',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  OnHold = 'On Hold'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;  // ID of the user who owns the task
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  completed: boolean;
  goalId?: string;
  recurrence?: TaskRecurrence;
  subTasks?: SubTask[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string[];  // Array of user IDs this task is assigned to
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;  // Progress percentage (0-100)
}