import { create } from 'zustand';
import { Book } from '../types';
import { books as initialBooks } from '../data/mockData';

interface BookState {
  books: Book[];
  filteredBooks: Book[];
  searchTerm: string;
  categoryFilter: string;
  
  fetchBooks: () => void;
  addBook: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  
  getBookById: (id: string) => Book | undefined;
}

export const useBookStore = create<BookState>()((set, get) => ({
  books: [],
  filteredBooks: [],
  searchTerm: '',
  categoryFilter: '',
  
  fetchBooks: () => {
    // In a real app, this would be an API call
    set({ 
      books: initialBooks,
      filteredBooks: initialBooks
    });
  },
  
  addBook: (bookData) => {
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substring(2, 9),
      addedAt: new Date().toISOString().split('T')[0],
    };
    
    set((state) => ({ 
      books: [...state.books, newBook],
      filteredBooks: applyFilters([...state.books, newBook], state.searchTerm, state.categoryFilter)
    }));
  },
  
  updateBook: (id, updatedBookData) => {
    set((state) => {
      const updatedBooks = state.books.map((book) => 
        book.id === id ? { ...book, ...updatedBookData } : book
      );
      
      return { 
        books: updatedBooks,
        filteredBooks: applyFilters(updatedBooks, state.searchTerm, state.categoryFilter)
      };
    });
  },
  
  deleteBook: (id) => {
    set((state) => {
      const updatedBooks = state.books.filter((book) => book.id !== id);
      
      return { 
        books: updatedBooks,
        filteredBooks: applyFilters(updatedBooks, state.searchTerm, state.categoryFilter)
      };
    });
  },
  
  setSearchTerm: (term) => {
    set((state) => ({
      searchTerm: term,
      filteredBooks: applyFilters(state.books, term, state.categoryFilter)
    }));
  },
  
  setCategoryFilter: (category) => {
    set((state) => ({
      categoryFilter: category,
      filteredBooks: applyFilters(state.books, state.searchTerm, category)
    }));
  },
  
  getBookById: (id) => {
    return get().books.find((book) => book.id === id);
  },
}));

// Helper function to apply filters
function applyFilters(books: Book[], searchTerm: string, categoryFilter: string): Book[] {
  return books.filter((book) => {
    const matchesSearch = searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesCategory = categoryFilter === '' || book.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
}