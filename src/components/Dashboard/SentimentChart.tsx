import React from 'react';

interface SentimentData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentChartProps {
  data: SentimentData[];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.positive, d.negative, d.neutral]));
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends (Last 7 Days)</h3>
      <div className="h-64 flex items-end space-x-4">
        {data.map((item, index) => {
          const positiveHeight = (item.positive / maxValue) * 100;
          const negativeHeight = (item.negative / maxValue) * 100;
          const neutralHeight = (item.neutral / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full flex flex-col items-end space-y-1 h-48">
                <div 
                  className="w-full bg-green-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${positiveHeight}%` }}
                  title={`Positive: ${item.positive}`}
                />
                <div 
                  className="w-full bg-yellow-500 opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${neutralHeight}%` }}
                  title={`Neutral: ${item.neutral}`}
                />
                <div 
                  className="w-full bg-red-500 rounded-b opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${negativeHeight}%` }}
                  title={`Negative: ${item.negative}`}
                />
              </div>
              <span className="text-xs text-gray-500 text-center">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Negative</span>
        </div>
      </div>
    </div>
  );
};