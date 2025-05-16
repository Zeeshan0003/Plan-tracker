import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressData {
  labels: string[];
  values: number[];
}

interface ProgressChartProps {
  title: string;
  data: ProgressData;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ title, data }) => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: '500',
        },
        color: '#374151',
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.values,
        backgroundColor: '#0A84FF',
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 25,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-64">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default ProgressChart;