export type UserRole = 'librarian' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used in mock data, would normally be stored securely
  role: UserRole;
  borrowedBooks: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  shelfLocation: string;
  coverImage?: string;
  addedAt: string;
}

export interface BorrowingRecord {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'requested' | 'issued' | 'returned' | 'overdue';
  fine?: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Report {
  type: 'issued' | 'overdue' | 'popular' | 'history';
  title: string;
  data: any[];
  generatedAt: string;
}