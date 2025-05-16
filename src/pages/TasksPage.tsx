import React, { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask, createTask } from '../services/tasksService';
import { Task, TaskPriority, TaskStatus } from '../types/Task';
import TaskCard from '../components/TaskCard';
import TaskStats from '../components/TaskStats';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Plus, X, AlertCircle, Search, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours?: number;
}

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TaskFormData>();
  
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);
  
  const loadTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks(user.id);
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTask = async (data: TaskFormData) => {
    if (!user) return;
    
    try {
      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority,
        status: data.status,
        completed: data.status === TaskStatus.Completed,
        estimatedHours: data.estimatedHours,
        progress: data.status === TaskStatus.Completed ? 100 : 0
      };
      
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      reset();
      setIsAddingTask(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };
  
  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority,
        status: data.status,
        completed: data.status === TaskStatus.Completed,
        estimatedHours: data.estimatedHours,
        progress: data.status === TaskStatus.Completed ? 100 : 
                 data.status === TaskStatus.InProgress ? 50 :
                 data.status === TaskStatus.NotStarted ? 0 : editingTask.progress
      });
      
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      reset();
      setEditingTask(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('dueDate', format(new Date(task.dueDate), 'yyyy-MM-dd'));
    setValue('priority', task.priority);
    setValue('status', task.status);
    setValue('estimatedHours', task.estimatedHours);
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
    reset();
  };
  
  const handleAddNewClick = () => {
    setIsAddingTask(true);
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: TaskPriority.Medium,
      status: TaskStatus.NotStarted
    });
  };
  
  const handleCancelAdd = () => {
    setIsAddingTask(false);
    reset();
  };
  
  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(task => 
      filterPriority === 'all' || task.priority === filterPriority
    )
    .filter(task => 
      filterStatus === 'all' || task.status === filterStatus
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { [TaskPriority.High]: 0, [TaskPriority.Medium]: 1, [TaskPriority.Low]: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {user && <TaskStats userId={user.id} />}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={handleAddNewClick}
          className="btn btn-primary flex items-center"
          disabled={isAddingTask}
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Task Form */}
      {(isAddingTask || editingTask) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={editingTask ? handleCancelEdit : handleCancelAdd}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(editingTask ? handleUpdateTask : handleCreateTask)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className={`mt-1 input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={`mt-1 input-field ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
                  {...register('description', { required: 'Description is required' })}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  className={`mt-1 input-field ${errors.dueDate ? 'border-red-300 focus:ring-red-500' : ''}`}
                  {...register('dueDate', { required: 'Due date is required' })}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  className={`mt-1 input-field ${errors.priority ? 'border-red-300 focus:ring-red-500' : ''}`}
                  {...register('priority', { required: 'Priority is required' })}
                >
                  <option value={TaskPriority.Low}>Low</option>
                  <option value={TaskPriority.Medium}>Medium</option>
                  <option value={TaskPriority.High}>High</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  className={`mt-1 input-field ${errors.status ? 'border-red-300 focus:ring-red-500' : ''}`}
                  {...register('status', { required: 'Status is required' })}
                >
                  <option value={TaskStatus.NotStarted}>Not Started</option>
                  <option value={TaskStatus.InProgress}>In Progress</option>
                  <option value={TaskStatus.Completed}>Completed</option>
                  <option value={TaskStatus.OnHold}>On Hold</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  id="estimatedHours"
                  min="0"
                  step="0.5"
                  className="mt-1 input-field"
                  {...register('estimatedHours')}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={editingTask ? handleCancelEdit : handleCancelAdd}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority-filter"
              className="mt-1 input-field"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
            >
              <option value="all">All Priorities</option>
              <option value={TaskPriority.Low}>Low</option>
              <option value={TaskPriority.Medium}>Medium</option>
              <option value={TaskPriority.High}>High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              className="mt-1 input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value={TaskStatus.NotStarted}>Not Started</option>
              <option value={TaskStatus.InProgress}>In Progress</option>
              <option value={TaskStatus.Completed}>Completed</option>
              <option value={TaskStatus.OnHold}>On Hold</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              id="sort"
              className="mt-1 input-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'title')}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => handleEdit(task)}
            onDelete={() => handleDeleteTask(task.id)}
          />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;