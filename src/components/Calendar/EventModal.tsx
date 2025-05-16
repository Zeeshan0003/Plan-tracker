import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../../types/CalendarEvent';
import { X, Clock, Calendar as CalendarIcon, FileText } from 'lucide-react';

interface EventModalProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-[#0A84FF] text-white p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-semibold">{event.title}</h3>
          {event.allDay ? (
            <div className="flex items-center mt-2">
              <CalendarIcon size={16} className="mr-2" />
              <span>All day</span>
            </div>
          ) : (
            <div className="flex items-center mt-2">
              <Clock size={16} className="mr-2" />
              <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start mb-4">
            <CalendarIcon size={18} className="mr-3 text-gray-500 mt-0.5" />
            <div>
              <p className="text-gray-800">{formatDate(event.start)}</p>
              {!event.allDay && event.start.toDateString() !== event.end.toDateString() && (
                <p className="text-gray-800">to {formatDate(event.end)}</p>
              )}
            </div>
          </div>
          
          {event.description && (
            <div className="flex items-start">
              <FileText size={18} className="mr-3 text-gray-500 mt-0.5" />
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}
        </div>
        
        <div className="border-t px-4 py-3 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;