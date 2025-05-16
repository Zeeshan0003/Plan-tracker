import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task, TaskPriority, TaskStatus } from '../types/Task';
import { Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityStyles = {
    [TaskPriority.Low]: 'bg-blue-100 text-blue-800',
    [TaskPriority.Medium]: 'bg-orange-100 text-orange-800',
    [TaskPriority.High]: 'bg-red-100 text-red-800',
  };
  
  const statusStyles = {
    [TaskStatus.NotStarted]: 'bg-gray-100 text-gray-800',
    [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800',
    [TaskStatus.Completed]: 'bg-green-100 text-green-800',
    [TaskStatus.OnHold]: 'bg-yellow-100 text-yellow-800',
  };
  
  return (
    <div 
      className={`card p-4 mb-4 ${task.status === TaskStatus.Completed ? 'opacity-70' : ''} transition-all duration-200 fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div>
            <h3 className={`text-lg font-medium ${task.status === TaskStatus.Completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <p className={`mt-1 text-sm ${task.status === TaskStatus.Completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">
                Due: {format(task.dueDate, 'MMM d, yyyy')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
                {task.status}
              </span>
              {task.estimatedHours && (
                <span className="text-xs text-gray-500">
                  Est. {task.estimatedHours}h
                </span>
              )}
              {task.progress !== undefined && (
                <span className="text-xs text-gray-500">
                  Progress: {task.progress}%
                </span>
              )}
              {task.tags && task.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`flex space-x-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-500 hover:text-[#0A84FF] transition-colors duration-200"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-500 hover:text-[#FF453A] transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;