import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';
import BookCard from '../components/books/BookCard';
import BookForm from '../components/books/BookForm';
import BookSearch from '../components/books/BookSearch';
import { Book } from '../types';

const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLibrarian } = useAuthStore();
  const { 
    books, filteredBooks, fetchBooks,
    addBook, updateBook, deleteBook, 
    setSearchTerm, setCategoryFilter,
    searchTerm, categoryFilter
  } = useBookStore();
  
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchBooks();
  }, [isAuthenticated, navigate, fetchBooks]);
  
  const handleAddBook = (bookData: Omit<Book, 'id' | 'addedAt'>) => {
    addBook(bookData);
    setShowAddBookForm(false);
    toast.success('Book added successfully');
  };
  
  const handleUpdateBook = (bookData: Omit<Book, 'id' | 'addedAt'>) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
      setEditingBook(null);
      toast.success('Book updated successfully');
    }
  };
  
  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
      toast.success('Book deleted successfully');
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-800">Book Catalog</h1>
        
        {isLibrarian() && (
          <button
            onClick={() => setShowAddBookForm(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Book
          </button>
        )}
      </div>
      
      <BookSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />
      
      {filteredBooks.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={isLibrarian() ? setEditingBook : undefined}
              onDelete={isLibrarian() ? handleDeleteBook : undefined}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No books found matching your criteria.</p>
          {searchTerm || categoryFilter ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
              className="text-primary-600 hover:text-primary-800 transition-colors"
            >
              Clear filters
            </button>
          ) : isLibrarian() ? (
            <button
              onClick={() => setShowAddBookForm(true)}
              className="text-primary-600 hover:text-primary-800 transition-colors"
            >
              Add your first book
            </button>
          ) : null}
        </div>
      )}
      
      <AnimatePresence>
        {showAddBookForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookForm
              onSubmit={handleAddBook}
              onCancel={() => setShowAddBookForm(false)}
            />
          </motion.div>
        )}
        
        {editingBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookForm
              initialBook={editingBook}
              onSubmit={handleUpdateBook}
              onCancel={() => setEditingBook(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksPage;