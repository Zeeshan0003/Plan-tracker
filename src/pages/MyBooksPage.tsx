import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuthStore } from '../store/authStore';
import { useBorrowingStore } from '../store/borrowingStore';
import BorrowingRecordItem from '../components/borrowing/BorrowingRecordItem';

const MyBooksPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLibrarian } = useAuthStore();
  const { borrowingRecords, fetchBorrowingRecords, getBorrowingRecordsByUserId } = useBorrowingStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isLibrarian()) {
      navigate('/dashboard');
      return;
    }
    
    fetchBorrowingRecords();
  }, [isAuthenticated, isLibrarian, navigate, fetchBorrowingRecords]);
  
  const userRecords = user ? getBorrowingRecordsByUserId(user.id) : [];
  
  // Filter records by status
  const currentlyBorrowed = userRecords.filter(record => record.status === 'issued' || record.status === 'overdue');
  const borrowingHistory = userRecords.filter(record => record.status === 'returned');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        My Books
      </h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-heading font-medium text-gray-800 mb-4">
          Currently Borrowed
        </h2>
        
        {currentlyBorrowed.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentlyBorrowed.map((record) => (
              <BorrowingRecordItem
                key={record.id}
                record={record}
              />
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">You don't have any borrowed books at the moment.</p>
            <button
              onClick={() => navigate('/books')}
              className="text-primary-600 hover:text-primary-800 transition-colors"
            >
              Browse Books
            </button>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-heading font-medium text-gray-800 mb-4">
          Borrowing History
        </h2>
        
        {borrowingHistory.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {borrowingHistory.map((record) => (
              <BorrowingRecordItem
                key={record.id}
                record={record}
              />
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">You don't have any borrowing history yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooksPage;