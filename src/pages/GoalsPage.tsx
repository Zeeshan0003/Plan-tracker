import React, { useState, useEffect } from 'react';
import { getGoals, updateGoal, deleteGoal, createGoal } from '../services/goalsService';
import { Goal } from '../types/Goal';
import GoalCard from '../components/GoalCard';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Plus, X, AlertCircle, Search } from 'lucide-react';

interface GoalFormData {
  title: string;
  description: string;
  targetDate: string;
}

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GoalFormData>();
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const fetchedGoals = await getGoals();
      setGoals(fetchedGoals);
    } catch (err: any) {
      setError(err.message || 'Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateGoal = async (data: GoalFormData) => {
    try {
      const newGoal: Omit<Goal, 'id'> = {
        title: data.title,
        description: data.description,
        targetDate: new Date(data.targetDate),
        progress: 0
      };
      
      const createdGoal = await createGoal(newGoal);
      setGoals([...goals, createdGoal]);
      reset();
      setIsAddingGoal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    }
  };
  
  const handleUpdateGoal = async (data: GoalFormData) => {
    if (!editingGoal) return;
    
    try {
      const updatedGoal = await updateGoal(editingGoal.id, {
        title: data.title,
        description: data.description,
        targetDate: new Date(data.targetDate)
      });
      
      setGoals(goals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      ));
      reset();
      setEditingGoal(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update goal');
    }
  };
  
  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete goal');
    }
  };
  
  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setValue('title', goal.title);
    setValue('description', goal.description);
    setValue('targetDate', format(new Date(goal.targetDate), 'yyyy-MM-dd'));
  };
  
  const handleCancelEdit = () => {
    setEditingGoal(null);
    reset();
  };
  
  const handleAddNewClick = () => {
    setIsAddingGoal(true);
    setEditingGoal(null);
    reset({
      title: '',
      description: '',
      targetDate: format(new Date(), 'yyyy-MM-dd')
    });
  };
  
  const handleCancelAdd = () => {
    setIsAddingGoal(false);
    reset();
  };
  
  const handleViewGoal = (id: string) => {
    // In a real app, this would navigate to a specific goal view
    console.log(`View tasks for goal: ${id}`);
  };
  
  const filteredGoals = goals
    .filter(goal => 
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
        <button
          onClick={handleAddNewClick}
          className="btn btn-primary flex items-center"
          disabled={isAddingGoal}
        >
          <Plus size={18} className="mr-1" />
          Add Goal
        </button>
      </div>
      
      {error && (
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
      )}
      
      {/* Add/Edit Goal Form */}
      {(isAddingGoal || editingGoal) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h2>
            <button
              onClick={editingGoal ? handleCancelEdit : handleCancelAdd}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(editingGoal ? handleUpdateGoal : handleCreateGoal)}>
            <div className="grid grid-cols-1 gap-4">
              <div>
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
              
              <div>
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
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                  Target Date
                </label>
                <input
                  type="date"
                  id="targetDate"
                  className={`mt-1 input-field ${errors.targetDate ? 'border-red-300 focus:ring-red-500' : ''}`}
                  {...register('targetDate', { required: 'Target date is required' })}
                />
                {errors.targetDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetDate.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={editingGoal ? handleCancelEdit : handleCancelAdd}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search goals..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Goal List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDeleteGoal}
              onView={handleViewGoal}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-2">No goals found</p>
            <p className="text-sm text-gray-500">
              {goals.length > 0 
                ? 'Try adjusting your search query'
                : 'Get started by adding your first goal'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;