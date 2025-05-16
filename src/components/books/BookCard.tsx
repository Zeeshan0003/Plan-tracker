import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useBorrowingStore } from '../../store/borrowingStore';
import { Edit, Trash, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const { user, isLibrarian } = useAuthStore();
  const { requestBorrow } = useBorrowingStore();
  
  const handleBorrowRequest = () => {
    if (!user) {
      toast.error('You must be logged in to borrow a book');
      return;
    }
    
    if (book.availableQuantity <= 0) {
      toast.error('This book is currently unavailable');
      return;
    }
    
    const success = requestBorrow(book.id, user.id, user.name, book.title);
    
    if (success) {
      toast.success('Borrow request submitted successfully');
    } else {
      toast.error('You have reached the maximum borrowing limit (3 books)');
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={book.coverImage || 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-heading font-medium text-gray-800 mb-1 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>ISBN: {book.isbn}</span>
          <span>{book.category}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              <span className={`font-medium ${book.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.availableQuantity} of {book.quantity} available
              </span>
            </p>
            <p className="text-xs text-gray-500">Location: {book.shelfLocation}</p>
          </div>
          
          <div className="flex space-x-2">
            {isLibrarian() ? (
              <>
                {onEdit && (
                  <button 
                    onClick={() => onEdit(book)}
                    className="p-1 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
                
                {onDelete && (
                  <button 
                    onClick={() => onDelete(book.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleBorrowRequest}
                disabled={book.availableQuantity <= 0}
                className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-md ${
                  book.availableQuantity > 0
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Borrow</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;