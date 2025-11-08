import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string; // Bootstrap icon class name (e.g., 'bi-chat-dots')
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon,
  iconColor = 'text-blue-600'
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 rounded-lg bg-opacity-10 ${iconColor.includes('blue') ? 'bg-blue-50' : iconColor.includes('green') ? 'bg-green-50' : iconColor.includes('red') ? 'bg-red-50' : iconColor.includes('yellow') ? 'bg-yellow-50' : 'bg-gray-50'}`}>
          <i className={`bi ${icon} ${iconColor}`} style={{ fontSize: '1.25rem' }}></i>
        </div>
        {change && (
          <span className={`text-xs sm:text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-xs sm:text-sm text-gray-500">{title}</p>
    </div>
  );
};