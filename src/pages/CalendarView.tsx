import React from 'react';
import Calendar from '../components/Calendar/CalendarView';

const CalendarView: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">
          View and manage your scheduled tasks and events
        </p>
      </div>
      
      <Calendar />
    </div>
  );
};

export default CalendarView;