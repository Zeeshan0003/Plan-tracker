import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Table as Tabs, Component as TabsContent, List as TabsList, Refrigerator as TabsTrigger } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useBorrowingStore } from '../store/borrowingStore';
import BorrowingRequestItem from '../components/borrowing/BorrowingRequestItem';
import BorrowingRecordItem from '../components/borrowing/BorrowingRecordItem';

const BorrowingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLibrarian } = useAuthStore();
  const {
    borrowingRecords,
    borrowingRequests,
    fetchBorrowingRecords,
    fetchBorrowingRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
    returnBook,
  } = useBorrowingStore();
  
  const [activeTab, setActiveTab] = useState('requests');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isLibrarian()) {
      navigate('/dashboard');
      return;
    }
    
    fetchBorrowingRecords();
    fetchBorrowingRequests();
  }, [isAuthenticated, isLibrarian, navigate, fetchBorrowingRecords, fetchBorrowingRequests]);
  
  const handleApproveRequest = (requestId: string, dueDate: string) => {
    approveBorrowRequest(requestId, dueDate);
    toast.success('Borrowing request approved successfully');
  };
  
  const handleRejectRequest = (requestId: string) => {
    rejectBorrowRequest(requestId);
    toast.success('Borrowing request rejected');
  };
  
  const handleReturnBook = (recordId: string) => {
    returnBook(recordId);
    toast.success('Book marked as returned successfully');
  };
  
  // Filter records by status
  const issuedRecords = borrowingRecords.filter(record => record.status === 'issued');
  const overdueRecords = borrowingRecords.filter(record => record.status === 'overdue');
  const returnedRecords = borrowingRecords.filter(record => record.status === 'returned');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        Borrowing Management
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 relative ${
                activeTab === 'requests'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Borrowing Requests
              {borrowingRequests.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {borrowingRequests.length}
                </span>
              )}
              {activeTab === 'requests' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('issued')}
              className={`py-2 px-1 relative ${
                activeTab === 'issued'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Issued Books
              {activeTab === 'issued' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('overdue')}
              className={`py-2 px-1 relative ${
                activeTab === 'overdue'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overdue Books
              {overdueRecords.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {overdueRecords.length}
                </span>
              )}
              {activeTab === 'overdue' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('returned')}
              className={`py-2 px-1 relative ${
                activeTab === 'returned'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Returned Books
              {activeTab === 'returned' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          {activeTab === 'requests' && (
            <div>
              <h2 className="text-lg font-heading font-medium text-gray-800 mb-4">
                Pending Borrowing Requests
              </h2>
              
              {borrowingRequests.length > 0 ? (
                <div>
                  {borrowingRequests.map((request) => (
                    <BorrowingRequestItem
                      key={request.id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No pending borrowing requests.</p>
              )}
            </div>
          )}
          
          {activeTab === 'issued' && (
            <div>
              <h2 className="text-lg font-heading font-medium text-gray-800 mb-4">
                Currently Issued Books
              </h2>
              
              {issuedRecords.length > 0 ? (
                <div>
                  {issuedRecords.map((record) => (
                    <BorrowingRecordItem
                      key={record.id}
                      record={record}
                      onReturn={handleReturnBook}
                      showUserName={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No books currently issued.</p>
              )}
            </div>
          )}
          
          {activeTab === 'overdue' && (
            <div>
              <h2 className="text-lg font-heading font-medium text-gray-800 mb-4">
                Overdue Books
              </h2>
              
              {overdueRecords.length > 0 ? (
                <div>
                  {overdueRecords.map((record) => (
                    <BorrowingRecordItem
                      key={record.id}
                      record={record}
                      onReturn={handleReturnBook}
                      showUserName={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No overdue books at the moment.</p>
              )}
            </div>
          )}
          
          {activeTab === 'returned' && (
            <div>
              <h2 className="text-lg font-heading font-medium text-gray-800 mb-4">
                Recently Returned Books
              </h2>
              
              {returnedRecords.length > 0 ? (
                <div>
                  {returnedRecords.map((record) => (
                    <BorrowingRecordItem
                      key={record.id}
                      record={record}
                      showUserName={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No returned books to show.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowingPage;