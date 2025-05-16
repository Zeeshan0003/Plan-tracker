import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, Clock, AlertTriangle, 
  BookCopy, BarChart4, User
} from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';
import { useBorrowingStore } from '../store/borrowingStore';
import { useNotificationStore } from '../store/notificationStore';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLibrarian } = useAuthStore();
  const { books, fetchBooks } = useBookStore();
  const { 
    borrowingRecords, borrowingRequests, 
    fetchBorrowingRecords, fetchBorrowingRequests,
    getBorrowingRecordsByUserId, getOverdueRecords
  } = useBorrowingStore();
  const { notifications, fetchNotifications, getNotificationsByUserId } = useNotificationStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchBooks();
    fetchBorrowingRecords();
    fetchBorrowingRequests();
    fetchNotifications();
  }, [isAuthenticated, navigate, fetchBooks, fetchBorrowingRecords, fetchBorrowingRequests, fetchNotifications]);
  
  const userNotifications = user ? getNotificationsByUserId(user.id) : [];
  const userBorrowings = user ? getBorrowingRecordsByUserId(user.id) : [];
  const overdueBooks = getOverdueRecords();
  
  // Stats for librarian dashboard
  const activeBooks = books.filter(book => book.availableQuantity > 0);
  const unavailableBooks = books.filter(book => book.availableQuantity === 0);
  const currentlyBorrowed = borrowingRecords.filter(record => record.status === 'issued');
  
  // Stats for student dashboard
  const borrowedBooks = userBorrowings.filter(record => record.status === 'issued');
  const returnedBooks = userBorrowings.filter(record => record.status === 'returned');
  const userOverdueBooks = userBorrowings.filter(record => record.status === 'overdue');
  
  const renderLibrarianDashboard = () => (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        Library Administration Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Books */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Books</h2>
              <p className="text-2xl font-bold text-gray-800">{books.length}</p>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-green-600">{activeBooks.length} Available</span>
            <span className="mx-2">•</span>
            <span className="text-red-600">{unavailableBooks.length} Unavailable</span>
          </div>
        </motion.div>
        
        {/* Active Borrowers */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="bg-accent-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Active Borrowers</h2>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(currentlyBorrowed.map(b => b.userId)).size}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-primary-600">{currentlyBorrowed.length} Books Currently Borrowed</span>
          </div>
        </motion.div>
        
        {/* Pending Requests */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Pending Requests</h2>
              <p className="text-2xl font-bold text-gray-800">{borrowingRequests.length}</p>
            </div>
          </div>
          <div className="mt-3">
            <button 
              onClick={() => navigate('/borrowing')}
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              View Pending Requests
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overdue Books */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-heading font-medium text-gray-800">Overdue Books</h2>
          </div>
          
          {overdueBooks.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {overdueBooks.map(record => (
                <div key={record.id} className="p-3 bg-red-50 rounded-md border-l-3 border-red-500">
                  <p className="font-medium text-gray-800">{record.bookTitle}</p>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">{record.userName}</span>
                    <span className="text-red-600">
                      Due: {record.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No overdue books at the moment.</p>
          )}
          
          <div className="mt-4">
            <button 
              onClick={() => navigate('/borrowing')}
              className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              View All Borrowings
            </button>
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-lg font-heading font-medium text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/books')}
              className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors flex flex-col items-center justify-center text-primary-800"
            >
              <BookCopy className="h-6 w-6 mb-2" />
              <span>Manage Books</span>
            </button>
            
            <button 
              onClick={() => navigate('/borrowing')}
              className="p-4 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors flex flex-col items-center justify-center text-accent-800"
            >
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Borrowings</span>
            </button>
            
            <button 
              onClick={() => navigate('/reports')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex flex-col items-center justify-center text-purple-800"
            >
              <BarChart4 className="h-6 w-6 mb-2" />
              <span>Generate Reports</span>
            </button>
            
            <button 
              onClick={() => navigate('/notifications')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center justify-center text-green-800"
            >
              <Bell className="h-6 w-6 mb-2" />
              <span>Notifications</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
  
  const renderStudentDashboard = () => (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        Welcome back, {user?.name}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Borrowed Books */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Currently Borrowed</h2>
              <p className="text-2xl font-bold text-gray-800">{borrowedBooks.length}</p>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-gray-600">Borrowing Limit: 3 Books</span>
          </div>
        </motion.div>
        
        {/* Books Returned */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Books Returned</h2>
              <p className="text-2xl font-bold text-gray-800">{returnedBooks.length}</p>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="text-gray-600">Total books you've returned</span>
          </div>
        </motion.div>
        
        {/* Notifications */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-accent-100 p-3 rounded-full">
              <Bell className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Notifications</h2>
              <p className="text-2xl font-bold text-gray-800">
                {userNotifications.filter(n => !n.read).length}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <button 
              onClick={() => navigate('/notifications')}
              className="text-sm text-accent-600 hover:text-accent-800 transition-colors"
            >
              View Notifications
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Books */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 text-primary-500 mr-2" />
            <h2 className="text-lg font-heading font-medium text-gray-800">My Books</h2>
          </div>
          
          {borrowedBooks.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {borrowedBooks.map(record => (
                <div key={record.id} className="p-3 bg-primary-50 rounded-md border-l-3 border-primary-500">
                  <p className="font-medium text-gray-800">{record.bookTitle}</p>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">Borrowed: {record.issueDate}</span>
                    <span className="text-primary-600">
                      Due: {record.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You don't have any borrowed books at the moment.</p>
          )}
          
          <div className="mt-4">
            <button 
              onClick={() => navigate('/my-books')}
              className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              View All My Books
            </button>
          </div>
        </motion.div>
        
        {/* Overdue Books */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-heading font-medium text-gray-800">Overdue Books</h2>
          </div>
          
          {userOverdueBooks.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {userOverdueBooks.map(record => (
                <div key={record.id} className="p-3 bg-red-50 rounded-md border-l-3 border-red-500">
                  <p className="font-medium text-gray-800">{record.bookTitle}</p>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">Due: {record.dueDate}</span>
                    <span className="text-red-600">
                      Fine: ${record.fine?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You don't have any overdue books.</p>
          )}
          
          <div className="mt-4">
            <button 
              onClick={() => navigate('/books')}
              className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Browse Books
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      {isLibrarian() ? renderLibrarianDashboard() : renderStudentDashboard()}
    </div>
  );
};

export default DashboardPage;