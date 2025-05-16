import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart4, FilePlus2 } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useReportStore } from '../store/reportStore';
import ReportCard from '../components/reports/ReportCard';
import ReportDetail from '../components/reports/ReportDetail';
import { Report } from '../types';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLibrarian } = useAuthStore();
  const { 
    reports,
    generateIssuedBooksReport,
    generateOverdueReport,
    generatePopularBooksReport,
  } = useReportStore();
  
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isLibrarian()) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isLibrarian, navigate]);
  
  const handleGenerateReport = (type: 'issued' | 'overdue' | 'popular') => {
    let report: Report;
    
    switch (type) {
      case 'issued':
        report = generateIssuedBooksReport();
        break;
      case 'overdue':
        report = generateOverdueReport();
        break;
      case 'popular':
        report = generatePopularBooksReport();
        break;
    }
    
    setSelectedReport(report);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        Library Reports
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-primary-100">
              <FilePlus2 className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-heading font-medium text-gray-800">
              Currently Issued Books
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Generate a report of all books currently issued to students.
          </p>
          
          <button
            onClick={() => handleGenerateReport('issued')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition-colors"
          >
            Generate Report
          </button>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-red-100">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-heading font-medium text-gray-800">
              Overdue Books
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Generate a report of all books that are currently overdue.
          </p>
          
          <button
            onClick={() => handleGenerateReport('overdue')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-colors"
          >
            Generate Report
          </button>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-accent-100">
              <BarChart4 className="h-6 w-6 text-accent-600" />
            </div>
            <h3 className="ml-3 text-lg font-heading font-medium text-gray-800">
              Most Popular Books
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Generate a report of the most frequently borrowed books.
          </p>
          
          <button
            onClick={() => handleGenerateReport('popular')}
            className="w-full bg-accent-600 hover:bg-accent-700 text-white py-2 rounded-md transition-colors"
          >
            Generate Report
          </button>
        </motion.div>
      </div>
      
      {reports.length > 0 && (
        <div>
          <h2 className="text-xl font-heading font-medium text-gray-800 mb-4">
            Recent Reports
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...reports].reverse().slice(0, 6).map((report) => (
              <ReportCard
                key={report.generatedAt}
                report={report}
                onViewReport={setSelectedReport}
              />
            ))}
          </div>
        </div>
      )}
      
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default ReportsPage;