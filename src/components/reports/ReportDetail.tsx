import React from 'react';
import { Report, BorrowingRecord } from '../../types';
import { X } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import BorrowingRecordItem from '../borrowing/BorrowingRecordItem';

interface ReportDetailProps {
  report: Report;
  onClose: () => void;
}

const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onClose }) => {
  const renderContent = () => {
    switch (report.type) {
      case 'issued':
      case 'overdue':
        return renderBorrowingList();
      case 'popular':
        return renderPopularBooksChart();
      case 'history':
        return renderHistoryReport();
      default:
        return <p>No data available</p>;
    }
  };

  const renderBorrowingList = () => {
    const records = report.data as BorrowingRecord[];
    
    if (records.length === 0) {
      return <p className="text-gray-500 text-center py-8">No records found</p>;
    }
    
    return (
      <div className="space-y-4">
        {records.map((record) => (
          <BorrowingRecordItem
            key={record.id}
            record={record}
            showUserName={true}
          />
        ))}
      </div>
    );
  };

  const renderPopularBooksChart = () => {
    const popularBooks = report.data as { bookId: string; title: string; borrowCount: number }[];
    
    if (popularBooks.length === 0) {
      return <p className="text-gray-500 text-center py-8">No data available</p>;
    }
    
    // Sort by borrow count in descending order
    const sortedBooks = [...popularBooks].sort((a, b) => b.borrowCount - a.borrowCount);
    
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Most Popular Books</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedBooks}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" tick={{ fontSize: 12 }} />
              <YAxis
                label={{ value: 'Borrow Count', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Bar dataKey="borrowCount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Books Ranked by Popularity</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left px-2 py-2 text-sm font-medium text-gray-600">Rank</th>
                  <th className="text-left px-2 py-2 text-sm font-medium text-gray-600">Title</th>
                  <th className="text-right px-2 py-2 text-sm font-medium text-gray-600">Borrows</th>
                </tr>
              </thead>
              <tbody>
                {sortedBooks.map((book, index) => (
                  <tr key={book.bookId} className="border-t border-gray-200">
                    <td className="px-2 py-3 text-sm text-gray-800">{index + 1}</td>
                    <td className="px-2 py-3 text-sm text-gray-800">{book.title}</td>
                    <td className="px-2 py-3 text-sm text-gray-800 text-right">{book.borrowCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryReport = () => {
    const records = report.data as BorrowingRecord[];
    
    if (records.length === 0) {
      return <p className="text-gray-500 text-center py-8">No borrowing history found</p>;
    }
    
    // Process data for the pie chart
    const statusCounts = records.reduce((acc, record) => {
      if (!acc[record.status]) {
        acc[record.status] = 0;
      }
      acc[record.status] += 1;
      return acc;
    }, {} as Record<string, number>);
    
    const pieData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
    
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Borrowing Status Overview</h3>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-3">Borrowing History</h3>
        <div className="space-y-4">
          {records.map((record) => (
            <BorrowingRecordItem
              key={record.id}
              record={record}
              showUserName={false}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            {report.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Generated on {report.generatedAt}
        </p>
        
        <div className="mt-4">
          {renderContent()}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;