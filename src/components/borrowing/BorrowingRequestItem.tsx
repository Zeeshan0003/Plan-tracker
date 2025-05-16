import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { BorrowingRecord } from '../../types';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';

interface BorrowingRequestItemProps {
  request: BorrowingRecord;
  onApprove: (requestId: string, dueDate: string) => void;
  onReject: (requestId: string) => void;
}

const BorrowingRequestItem: React.FC<BorrowingRequestItemProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 14), 'yyyy-MM-dd')
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-primary-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-heading text-lg font-medium text-gray-800">{request.bookTitle}</h3>
          <p className="text-sm text-gray-600">Requested by: {request.userName}</p>
          <p className="text-xs text-gray-500">Request date: {request.issueDate}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onApprove(request.id, dueDate)}
              className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200 transition-colors text-sm"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve</span>
            </button>
            
            <button
              onClick={() => onReject(request.id)}
              className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors text-sm"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowingRequestItem;