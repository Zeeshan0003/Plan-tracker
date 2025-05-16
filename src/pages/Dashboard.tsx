import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, deleteTask, updateTask } from '../services/tasksService';
import { getGoals } from '../services/goalsService';
import { Task, TaskPriority, TaskStatus } from '../types/Task';
import { Goal } from '../types/Goal';
import TaskCard from '../components/TaskCard';
import ProgressChart from '../components/ProgressChart';
import { format, subDays, isSameDay } from 'date-fns';
import { ArrowRight, CheckSquare, Target, Calendar, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.Completed).length;
  const upcomingTasks = tasks.filter(task => 
    task.status !== TaskStatus.Completed && 
    new Date(task.dueDate) > new Date()
  ).length;
  const overdueTasksCount = tasks.filter(task => 
    task.status !== TaskStatus.Completed && 
    new Date(task.dueDate) < new Date()
  ).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const overdueTasks = tasks
    .filter(task => 
      task.status !== TaskStatus.Completed && 
      new Date(task.dueDate) < new Date()
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Prepare data for chart
  const getTasksCompletionData = () => {
    const today = new Date();
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      return format(date, 'EEE');
    });
    
    const values = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      return tasks.filter(task => 
        task.status === TaskStatus.Completed && 
        isSameDay(new Date(task.updatedAt), date)
      ).length;
    });
    
    return { labels, values };
  };
  
  const getGoalProgressData = () => {
    return {
      labels: goals.map(goal => goal.title),
      values: goals.map(goal => goal.progress)
    };
  };
  
  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTasks, fetchedGoals] = await Promise.all([
        getTasks(user.id),
        getGoals()
      ]);
      setTasks(fetchedTasks);
      setGoals(fetchedGoals);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [user]);
  
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };
  
  const handleEditTask = async (task: Task) => {
    // Navigate to tasks page with the task to edit
    window.location.href = `/tasks?edit=${task.id}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here's your progress for today.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#0A84FF]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="p-2 bg-[#0A84FF] bg-opacity-10 rounded-lg">
              <CheckSquare size={20} className="text-[#0A84FF]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-medium text-green-500">
              {completedTasks} completed
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#30D158]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate.toFixed(0)}%</p>
            </div>
            <div className="p-2 bg-[#30D158] bg-opacity-10 rounded-lg">
              <Target size={20} className="text-[#30D158]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-500">
              {totalTasks > 0 ? `${completedTasks}/${totalTasks} tasks` : 'No tasks yet'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#FF9F0A]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingTasks}</p>
            </div>
            <div className="p-2 bg-[#FF9F0A] bg-opacity-10 rounded-lg">
              <Calendar size={20} className="text-[#FF9F0A]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-500">
              Due in the next 7 days
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#FF453A]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasksCount}</p>
            </div>
            <div className="p-2 bg-[#FF453A] bg-opacity-10 rounded-lg">
              <AlertCircle size={20} className="text-[#FF453A]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-500">
              Need immediate attention
            </span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProgressChart 
          title="Tasks Completed (Last 7 Days)" 
          data={getTasksCompletionData()} 
        />
        <ProgressChart 
          title="Goal Progress" 
          data={getGoalProgressData()} 
        />
      </div>
      
      {/* Overdue Tasks Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Overdue Tasks</h2>
          <Link to="/tasks" className="text-sm font-medium text-[#0A84FF] hover:text-[#0068D6] flex items-center">
            View all tasks
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {overdueTasks.length > 0 ? (
          <div>
            {overdueTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-600">No overdue tasks! You're all caught up.</p>
          </div>
        )}
      </div>
      
      {/* Today's Tasks */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Today's Tasks</h2>
          <Link to="/calendar" className="text-sm font-medium text-[#0A84FF] hover:text-[#0068D6] flex items-center">
            View calendar
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          const today = new Date();
          return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear()
          );
        }).length > 0 ? (
          <div>
            {tasks
              .filter(task => {
                const taskDate = new Date(task.dueDate);
                const today = new Date();
                return (
                  taskDate.getDate() === today.getDate() &&
                  taskDate.getMonth() === today.getMonth() &&
                  taskDate.getFullYear() === today.getFullYear()
                );
              })
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-600">No tasks due today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;