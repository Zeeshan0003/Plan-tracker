import React from 'react';
import { 
  BarChart as BarChartIcon, FileText, 
  PieChart as PieChartIcon, Clock 
} from 'lucide-react';
import { Report } from '../../types';

interface ReportCardProps {
  report: Report;
  onViewReport: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onViewReport }) => {
  const getIcon = () => {
    switch (report.type) {
      case 'issued':
        return <FileText className="h-6 w-6 text-primary-500" />;
      case 'overdue':
        return <Clock className="h-6 w-6 text-red-500" />;
      case 'popular':
        return <BarChartIcon className="h-6 w-6 text-accent-500" />;
      case 'history':
        return <PieChartIcon className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-primary-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {getIcon()}
        <h3 className="ml-2 text-lg font-heading font-semibold text-gray-800">
          {report.title}
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {report.data.length} {report.data.length === 1 ? 'record' : 'records'}
      </p>
      
      <p className="text-xs text-gray-500 mb-4">
        Generated: {report.generatedAt}
      </p>
      
      <button
        onClick={() => onViewReport(report)}
        className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 rounded-md transition-colors flex items-center justify-center"
      >
        <span>View Report</span>
      </button>
    </div>
  );
};

export default ReportCard;