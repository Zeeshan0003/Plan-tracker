import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { getEvents } from '../../services/calendarService';
import { CalendarEvent } from '../../types/CalendarEvent';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventModal from './EventModal';

enum CalendarViewType {
  Day = 'day',
  Week = 'week',
  Month = 'month'
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>(CalendarViewType.Month);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    let start: Date, end: Date;
    
    if (viewType === CalendarViewType.Month) {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    } else if (viewType === CalendarViewType.Week) {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    } else {
      start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
    }
    
    const loadEvents = async () => {
      try {
        const fetchedEvents = await getEvents(start, end);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error loading events', error);
      }
    };
    
    loadEvents();
  }, [currentDate, viewType]);
  
  const renderHeader = () => {
    let dateFormat = 'MMMM yyyy';
    if (viewType === CalendarViewType.Day) {
      dateFormat = 'EEEE, MMMM d, yyyy';
    } else if (viewType === CalendarViewType.Week) {
      dateFormat = 'MMMM d, yyyy';
      const endDate = endOfWeek(currentDate);
      return (
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-semibold">
              {format(currentDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex space-x-4">
            <ViewTypeSelector />
            <NavButtons />
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xl font-semibold">
            {format(currentDate, dateFormat)}
          </span>
        </div>
        <div className="flex space-x-4">
          <ViewTypeSelector />
          <NavButtons />
        </div>
      </div>
    );
  };
  
  const ViewTypeSelector = () => (
    <div className="flex border rounded-md overflow-hidden">
      <button
        className={`px-3 py-1.5 text-sm ${viewType === CalendarViewType.Day ? 'bg-[#0A84FF] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setViewType(CalendarViewType.Day)}
      >
        Day
      </button>
      <button
        className={`px-3 py-1.5 text-sm ${viewType === CalendarViewType.Week ? 'bg-[#0A84FF] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setViewType(CalendarViewType.Week)}
      >
        Week
      </button>
      <button
        className={`px-3 py-1.5 text-sm ${viewType === CalendarViewType.Month ? 'bg-[#0A84FF] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setViewType(CalendarViewType.Month)}
      >
        Month
      </button>
    </div>
  );
  
  const NavButtons = () => (
    <div className="flex border rounded-md overflow-hidden">
      <button
        className="p-1.5 bg-white text-gray-700 hover:bg-gray-100"
        onClick={prevNav}
      >
        <ChevronLeft size={16} />
      </button>
      <button
        className="px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-100 text-sm"
        onClick={() => setCurrentDate(new Date())}
      >
        Today
      </button>
      <button
        className="p-1.5 bg-white text-gray-700 hover:bg-gray-100"
        onClick={nextNav}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
  
  const renderDays = () => {
    const dateFormat = 'EEEE';
    const days = [];
    let startDate = startOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col-span-1 text-center font-medium py-2 text-sm text-gray-600" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 border-b">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        days.push(
          <div
            className={`col-span-1 border-t border-l h-24 p-1 overflow-y-auto ${
              i === 6 ? 'border-r' : ''
            } ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
            key={day.toString()}
          >
            <div className={`text-right p-1 ${
              isSameDay(day, new Date()) ? 'bg-[#0A84FF] text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto' : ''
            }`}>
              {format(day, 'd')}
            </div>
            <div className="mt-1">
              {events
                .filter(event => 
                  isSameDay(event.start, cloneDay)
                )
                .slice(0, 2)
                .map(event => (
                  <div
                    key={event.id}
                    className="px-1.5 py-0.5 mb-1 text-xs rounded bg-[#0A84FF] bg-opacity-10 text-[#0A84FF] truncate cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsModalOpen(true);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              {events.filter(event => 
                isSameDay(event.start, cloneDay)
              ).length > 2 && (
                <div className="text-xs text-gray-500 px-1.5">
                  +{events.filter(event => 
                    isSameDay(event.start, cloneDay)
                  ).length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="border-b border-r">{rows}</div>;
  };
  
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-1 gap-0">
          {hours.map(hour => {
            const eventsInHour = events.filter(event => {
              const eventHour = new Date(event.start).getHours();
              return eventHour === hour && isSameDay(event.start, currentDate);
            });
            
            return (
              <div key={hour} className="flex border-b last:border-b-0">
                <div className="w-16 py-2 px-2 text-right text-sm text-gray-500 border-r bg-gray-50">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div className="flex-grow p-1 min-h-[60px]">
                  {eventsInHour.map(event => (
                    <div
                      key={event.id}
                      className="px-2 py-1 mb-1 text-sm rounded bg-[#0A84FF] bg-opacity-10 text-[#0A84FF] cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="col-span-1 bg-gray-50"></div>
          {days.map((day, i) => (
            <div 
              key={i}
              className={`col-span-1 text-center py-2 text-sm font-medium ${
                isSameDay(day, new Date()) ? 'bg-[#0A84FF] bg-opacity-10' : 'bg-gray-50'
              }`}
            >
              <div>{format(day, 'EEE')}</div>
              <div className={`mt-1 inline-block rounded-full w-7 h-7 flex items-center justify-center ${
                isSameDay(day, new Date()) ? 'bg-[#0A84FF] text-white' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div>
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
              <div className="col-span-1 py-2 px-2 text-right text-sm text-gray-500 border-r bg-gray-50">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              
              {days.map((day, i) => {
                const eventsInCell = events.filter(event => {
                  const eventHour = new Date(event.start).getHours();
                  return eventHour === hour && isSameDay(event.start, day);
                });
                
                return (
                  <div 
                    key={i}
                    className={`col-span-1 p-1 min-h-[60px] border-r last:border-r-0 ${
                      isSameDay(day, new Date()) ? 'bg-[#0A84FF] bg-opacity-5' : ''
                    }`}
                  >
                    {eventsInCell.map(event => (
                      <div
                        key={event.id}
                        className="px-1.5 py-0.5 mb-1 text-xs rounded bg-[#0A84FF] bg-opacity-10 text-[#0A84FF] truncate cursor-pointer"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsModalOpen(true);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const nextNav = () => {
    if (viewType === CalendarViewType.Month) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewType === CalendarViewType.Week) {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };
  
  const prevNav = () => {
    if (viewType === CalendarViewType.Month) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewType === CalendarViewType.Week) {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  
  return (
    <div className="calendar bg-white rounded-xl shadow-sm p-6">
      {renderHeader()}
      
      <div className="mb-6">
        {viewType === CalendarViewType.Month && (
          <>
            {renderDays()}
            {renderCells()}
          </>
        )}
        
        {viewType === CalendarViewType.Week && renderWeekView()}
        
        {viewType === CalendarViewType.Day && renderDayView()}
      </div>
      
      {isModalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CalendarView;