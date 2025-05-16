import React from 'react';
import { BorrowingRecord } from '../../types';
import { differenceInDays, parseISO } from 'date-fns';
import { CheckCircle as CircleCheck, RotateCcw, AlertTriangle, Clock } from 'lucide-react';

interface BorrowingRecordItemProps {
  record: BorrowingRecord;
  onReturn?: (recordId: string) => void;
  showUserName?: boolean;
}

const BorrowingRecordItem: React.FC<BorrowingRecordItemProps> = ({
  record,
  onReturn,
  showUserName = false,
}) => {
  const getStatusIcon = () => {
    switch (record.status) {
      case 'issued':
        return <Clock className="h-5 w-5 text-primary-500" />;
      case 'returned':
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClassName = () => {
    switch (record.status) {
      case 'issued':
        return 'bg-primary-100 text-primary-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getDaysRemaining = () => {
    if (record.status === 'returned') return null;
    
    const today = new Date();
    const dueDate = parseISO(record.dueDate);
    const days = differenceInDays(dueDate, today);
    
    if (days < 0) {
      return <span className="text-red-600 font-medium">{Math.abs(days)} days overdue</span>;
    }
    
    return <span className="text-primary-600 font-medium">{days} days remaining</span>;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-primary-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-heading text-lg font-medium text-gray-800">{record.bookTitle}</h3>
          
          {showUserName && (
            <p className="text-sm text-gray-600">Borrowed by: {record.userName}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
            <span>Issued: {record.issueDate}</span>
            <span>•</span>
            <span>Due: {record.dueDate}</span>
            {record.returnDate && (
              <>
                <span>•</span>
                <span>Returned: {record.returnDate}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusClassName()}`}>
            {getStatusIcon()}
            <span className="capitalize">{record.status}</span>
          </div>
          
          {record.status !== 'returned' && getDaysRemaining()}
          
          {record.fine && record.fine > 0 && (
            <div className="text-red-600 font-medium text-sm">
              Fine: ${record.fine.toFixed(2)}
            </div>
          )}
          
          {onReturn && record.status === 'issued' && (
            <button
              onClick={() => onReturn(record.id)}
              className="flex items-center space-x-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-md hover:bg-primary-200 transition-colors text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Return</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowingRecordItem;