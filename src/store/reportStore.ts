import { create } from 'zustand';
import { Report } from '../types';
import { useBorrowingStore } from './borrowingStore';
import { useBookStore } from './bookStore';
import { format } from 'date-fns';

interface ReportState {
  reports: Report[];
  generateIssuedBooksReport: () => Report;
  generateOverdueReport: () => Report;
  generatePopularBooksReport: () => Report;
  generateUserHistoryReport: (userId: string) => Report;
}

export const useReportStore = create<ReportState>()((set, get) => ({
  reports: [],
  
  generateIssuedBooksReport: () => {
    const currentlyIssued = useBorrowingStore.getState().getCurrentlyBorrowedBooks();
    
    const report: Report = {
      type: 'issued',
      title: 'Currently Issued Books',
      data: currentlyIssued,
      generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    
    set((state) => ({
      reports: [...state.reports, report],
    }));
    
    return report;
  },
  
  generateOverdueReport: () => {
    const overdueBooks = useBorrowingStore.getState().getOverdueRecords();
    
    const report: Report = {
      type: 'overdue',
      title: 'Overdue Books',
      data: overdueBooks,
      generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    
    set((state) => ({
      reports: [...state.reports, report],
    }));
    
    return report;
  },
  
  generatePopularBooksReport: () => {
    const borrowingRecords = useBorrowingStore.getState().borrowingRecords;
    const books = useBookStore.getState().books;
    
    // Count borrowing frequency for each book
    const bookBorrowCounts = borrowingRecords.reduce((acc, record) => {
      if (!acc[record.bookId]) {
        acc[record.bookId] = {
          count: 0,
          title: record.bookTitle,
        };
      }
      acc[record.bookId].count += 1;
      return acc;
    }, {} as Record<string, { count: number; title: string }>);
    
    // Convert to array and sort by count
    const popularBooks = Object.entries(bookBorrowCounts)
      .map(([bookId, { count, title }]) => ({
        bookId,
        title,
        borrowCount: count,
      }))
      .sort((a, b) => b.borrowCount - a.borrowCount);
    
    const report: Report = {
      type: 'popular',
      title: 'Most Popular Books',
      data: popularBooks,
      generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    
    set((state) => ({
      reports: [...state.reports, report],
    }));
    
    return report;
  },
  
  generateUserHistoryReport: (userId) => {
    const userHistory = useBorrowingStore.getState().getBorrowingRecordsByUserId(userId);
    
    const report: Report = {
      type: 'history',
      title: 'User Borrowing History',
      data: userHistory,
      generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    
    set((state) => ({
      reports: [...state.reports, report],
    }));
    
    return report;
  },
}));