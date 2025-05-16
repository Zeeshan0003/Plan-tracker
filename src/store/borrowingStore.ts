import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BorrowingRecord, Book } from '../types';
import { borrowingRecords as initialRecords, borrowingRequests as initialRequests } from '../data/mockData';
import { differenceInDays, parseISO } from 'date-fns';
import { useBookStore } from './bookStore';

interface BorrowingState {
  borrowingRecords: BorrowingRecord[];
  borrowingRequests: BorrowingRecord[];
  
  fetchBorrowingRecords: () => void;
  fetchBorrowingRequests: () => void;
  
  requestBorrow: (bookId: string, userId: string, userName: string, bookTitle: string) => boolean;
  approveBorrowRequest: (requestId: string, dueDate: string) => void;
  rejectBorrowRequest: (requestId: string) => void;
  returnBook: (recordId: string) => void;
  
  getBorrowingRecordsByUserId: (userId: string) => BorrowingRecord[];
  getOverdueRecords: () => BorrowingRecord[];
  getCurrentlyBorrowedBooks: () => BorrowingRecord[];
  
  calculateFine: (record: BorrowingRecord) => number;
}

export const useBorrowingStore = create<BorrowingState>()(
  persist(
    (set, get) => ({
      borrowingRecords: [],
      borrowingRequests: [],
      
      fetchBorrowingRecords: () => {
        // In a real app, this would be an API call
        set({ borrowingRecords: initialRecords });
      },
      
      fetchBorrowingRequests: () => {
        // In a real app, this would be an API call
        set({ borrowingRequests: initialRequests });
      },
      
      requestBorrow: (bookId, userId, userName, bookTitle) => {
        // Check if the user has already borrowed 3 books
        const userBorrowedBooks = get().borrowingRecords.filter(
          (record) => record.userId === userId && record.status === 'issued'
        );
        
        if (userBorrowedBooks.length >= 3) {
          return false; // Maximum borrowing limit reached
        }
        
        const newRequest: BorrowingRecord = {
          id: Math.random().toString(36).substring(2, 9),
          bookId,
          userId,
          userName,
          bookTitle,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: '', // Will be set when approved
          status: 'requested',
        };
        
        set((state) => ({
          borrowingRequests: [...state.borrowingRequests, newRequest],
        }));
        
        return true;
      },
      
      approveBorrowRequest: (requestId, dueDate) => {
        set((state) => {
          const request = state.borrowingRequests.find(r => r.id === requestId);
          
          if (!request) return state;
          
          const updatedRequests = state.borrowingRequests.filter(r => r.id !== requestId);
          
          // Update the request to an active borrowing record
          const newRecord: BorrowingRecord = {
            ...request,
            status: 'issued',
            dueDate,
          };
          
          // Update book availability
          const book = useBookStore.getState().getBookById(request.bookId);
          if (book && book.availableQuantity > 0) {
            useBookStore.getState().updateBook(book.id, {
              availableQuantity: book.availableQuantity - 1
            });
          }
          
          return {
            borrowingRequests: updatedRequests,
            borrowingRecords: [...state.borrowingRecords, newRecord],
          };
        });
      },
      
      rejectBorrowRequest: (requestId) => {
        set((state) => ({
          borrowingRequests: state.borrowingRequests.filter(r => r.id !== requestId),
        }));
      },
      
      returnBook: (recordId) => {
        set((state) => {
          const record = state.borrowingRecords.find(r => r.id === recordId);
          
          if (!record) return state;
          
          const returnDate = new Date().toISOString().split('T')[0];
          const fine = get().calculateFine(record);
          
          const updatedRecords = state.borrowingRecords.map(r => {
            if (r.id === recordId) {
              return {
                ...r,
                status: 'returned',
                returnDate,
                fine: fine > 0 ? fine : undefined,
              };
            }
            return r;
          });
          
          // Update book availability
          const book = useBookStore.getState().getBookById(record.bookId);
          if (book) {
            useBookStore.getState().updateBook(book.id, {
              availableQuantity: book.availableQuantity + 1
            });
          }
          
          return {
            borrowingRecords: updatedRecords,
          };
        });
      },
      
      getBorrowingRecordsByUserId: (userId) => {
        return get().borrowingRecords.filter(r => r.userId === userId);
      },
      
      getOverdueRecords: () => {
        const today = new Date();
        return get().borrowingRecords.filter(r => {
          if (r.status === 'returned') return false;
          const dueDate = parseISO(r.dueDate);
          return dueDate < today;
        });
      },
      
      getCurrentlyBorrowedBooks: () => {
        return get().borrowingRecords.filter(r => r.status === 'issued');
      },
      
      calculateFine: (record) => {
        if (record.status === 'returned') {
          if (record.fine) return record.fine;
          return 0;
        }
        
        // Calculate days overdue
        const today = new Date();
        const dueDate = parseISO(record.dueDate);
        
        if (dueDate > today) return 0;
        
        // $2 per day overdue
        const daysOverdue = differenceInDays(today, dueDate);
        return daysOverdue * 2;
      },
    }),
    {
      name: 'borrowing-storage',
    }
  )
);