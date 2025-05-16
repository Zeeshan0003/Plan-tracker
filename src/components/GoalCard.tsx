import React from 'react';
import { format } from 'date-fns';
import { Goal } from '../types/Goal';
import { Edit, Trash2, ChevronRight } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="card p-4 mb-4 transition-all duration-200 fade-in">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-800">{goal.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-1 text-gray-500 hover:text-[#0A84FF] transition-colors duration-200"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1 text-gray-500 hover:text-[#FF453A] transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{goal.description}</p>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#0A84FF] h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Target: {format(goal.targetDate, 'MMM d, yyyy')}
        </span>
        <button
          onClick={() => onView(goal.id)}
          className="flex items-center text-sm font-medium text-[#0A84FF] hover:text-[#0068D6] transition-colors duration-200"
        >
          View Tasks
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default GoalCard;