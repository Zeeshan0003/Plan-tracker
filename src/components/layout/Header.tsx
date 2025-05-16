import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { BookOpen, Bell, LogOut, User, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, isLibrarian } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const unreadCount = user ? getUnreadCount(user.id) : 0;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center">
            <BookOpen className="h-8 w-8 mr-2" />
            <span className="font-heading text-2xl">Campus Library Hub</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/books" className="hover:text-primary-200 transition-colors">
                  Books
                </Link>
                
                {isLibrarian() ? (
                  <>
                    <Link to="/borrowing" className="hover:text-primary-200 transition-colors">
                      Borrowing
                    </Link>
                    <Link to="/reports" className="hover:text-primary-200 transition-colors">
                      Reports
                    </Link>
                  </>
                ) : (
                  <Link to="/my-books" className="hover:text-primary-200 transition-colors">
                    My Books
                  </Link>
                )}
                
                <Link to="/notifications" className="relative hover:text-primary-200 transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                
                <div className="flex items-center space-x-1 cursor-pointer hover:text-primary-200 transition-colors" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-800 rounded-full p-1">
                    <User className="h-5 w-5" />
                  </div>
                  <span>{user?.name}</span>
                </div>
              </div>
              
              <button 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-primary-200 transition-colors">
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 space-y-3 py-4 border-t border-primary-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              to="/books" 
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Books
            </Link>
            
            {isLibrarian() ? (
              <>
                <Link 
                  to="/borrowing" 
                  className="block hover:text-primary-200 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Borrowing
                </Link>
                <Link 
                  to="/reports" 
                  className="block hover:text-primary-200 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Reports
                </Link>
              </>
            ) : (
              <Link 
                to="/my-books" 
                className="block hover:text-primary-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Books
              </Link>
            )}
            
            <Link 
              to="/notifications" 
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-accent-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </Link>
            
            <div 
              className="block hover:text-primary-200 transition-colors py-2 cursor-pointer"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              Logout
            </div>
            
            <div className="flex items-center space-x-2 py-2">
              <div className="bg-primary-800 rounded-full p-1">
                <User className="h-5 w-5" />
              </div>
              <span>{user?.name}</span>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;