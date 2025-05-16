import { Book, BorrowingRecord, User, Notification } from '../types';
import { addDays, format, subDays } from 'date-fns';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin Librarian',
    email: 'admin@library.edu',
    password: 'admin123', // In a real app, this would be hashed
    role: 'librarian',
    borrowedBooks: [],
  },
  {
    id: '2',
    name: 'John Student',
    email: 'john@student.edu',
    password: 'john123', // In a real app, this would be hashed
    role: 'student',
    borrowedBooks: ['1', '3'],
  },
  {
    id: '3',
    name: 'Sarah Student',
    email: 'sarah@student.edu',
    password: 'sarah123', // In a real app, this would be hashed
    role: 'student',
    borrowedBooks: ['2'],
  },
];

// Mock Books
export const books: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    category: 'Fiction',
    quantity: 5,
    availableQuantity: 4,
    shelfLocation: 'A1-23',
    coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    addedAt: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    category: 'Fiction',
    quantity: 3,
    availableQuantity: 2,
    shelfLocation: 'A2-15',
    coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    addedAt: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '9780262033848',
    category: 'Computer Science',
    quantity: 2,
    availableQuantity: 1,
    shelfLocation: 'C3-42',
    coverImage: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    addedAt: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '9781285741550',
    category: 'Mathematics',
    quantity: 4,
    availableQuantity: 4,
    shelfLocation: 'B2-31',
    coverImage: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    addedAt: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
  },
  {
    id: '5',
    title: 'The Origin of Species',
    author: 'Charles Darwin',
    isbn: '9780451529060',
    category: 'Science',
    quantity: 2,
    availableQuantity: 2,
    shelfLocation: 'D1-12',
    coverImage: 'https://images.pexels.com/photos/2674052/pexels-photo-2674052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    addedAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  },
];

// Mock Borrowing Records
export const borrowingRecords: BorrowingRecord[] = [
  {
    id: '1',
    bookId: '1',
    userId: '2',
    userName: 'John Student',
    bookTitle: 'To Kill a Mockingbird',
    issueDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    status: 'issued',
  },
  {
    id: '2',
    bookId: '2',
    userId: '3',
    userName: 'Sarah Student',
    bookTitle: 'The Great Gatsby',
    issueDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    dueDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    status: 'issued',
  },
  {
    id: '3',
    bookId: '3',
    userId: '2',
    userName: 'John Student',
    bookTitle: 'Introduction to Algorithms',
    issueDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    dueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    status: 'issued',
  },
  {
    id: '4',
    bookId: '5',
    userId: '3',
    userName: 'Sarah Student',
    bookTitle: 'The Origin of Species',
    issueDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    dueDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    status: 'returned',
    returnDate: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
    fine: 4,
  },
  {
    id: '5',
    bookId: '4',
    userId: '2',
    userName: 'John Student',
    bookTitle: 'Calculus: Early Transcendentals',
    issueDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    status: 'overdue',
    fine: 6,
  },
];

// Mock Borrowing Requests
export const borrowingRequests: BorrowingRecord[] = [
  {
    id: '6',
    bookId: '4',
    userId: '3',
    userName: 'Sarah Student',
    bookTitle: 'Calculus: Early Transcendentals',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    status: 'requested',
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    message: 'Your book "To Kill a Mockingbird" is due in 5 days',
    type: 'warning',
    read: false,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    userId: '3',
    message: 'Your book "The Great Gatsby" is due in 10 days',
    type: 'info',
    read: false,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    userId: '2',
    message: 'Your book "Calculus: Early Transcendentals" is overdue by 2 days. Fine: $6',
    type: 'error',
    read: false,
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
  },
];

// Mock Categories
export const categories = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Mathematics',
  'Computer Science',
  'History',
  'Biography',
  'Self-Help',
  'Reference',
  'Business',
];