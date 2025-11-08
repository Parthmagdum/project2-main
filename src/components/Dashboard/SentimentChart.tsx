import React, { useState } from 'react';

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
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxValue = Math.max(...data.flatMap(d => [d.positive, d.negative, d.neutral]));
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Sentiment Trends (Last 7 Days)
        </h3>
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Neutral</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Negative</span>
          </div>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="relative">
        <div className="h-48 sm:h-56 md:h-64 flex items-end gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2">
          {data.map((item, index) => {
            const positiveHeight = (item.positive / maxValue) * 100;
            const negativeHeight = (item.negative / maxValue) * 100;
            const neutralHeight = (item.neutral / maxValue) * 100;
            const isHovered = hoveredBar === index;
            
            return (
              <div 
                key={index} 
                className="flex-1 min-w-[40px] sm:min-w-[50px] flex flex-col items-center gap-2 relative"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg z-10 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Positive: {item.positive}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Neutral: {item.neutral}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Negative: {item.negative}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
                
                {/* Bars Container */}
                <div className="w-full flex flex-col items-center justify-end gap-0.5 h-40 sm:h-48 md:h-56">
                  {/* Positive Bar */}
                  <div 
                    className={`w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-300 ${
                      isHovered ? 'opacity-100 shadow-lg scale-105' : 'opacity-80'
                    }`}
                    style={{ height: `${positiveHeight}%` }}
                  >
                    {positiveHeight > 10 && (
                      <div className="text-white text-[10px] sm:text-xs font-semibold text-center pt-1">
                        {item.positive}
                      </div>
                    )}
                  </div>
                  
                  {/* Neutral Bar */}
                  <div 
                    className={`w-full bg-gradient-to-t from-yellow-500 to-yellow-400 transition-all duration-300 ${
                      isHovered ? 'opacity-100 shadow-lg scale-105' : 'opacity-80'
                    }`}
                    style={{ height: `${neutralHeight}%` }}
                  >
                    {neutralHeight > 10 && (
                      <div className="text-white text-[10px] sm:text-xs font-semibold text-center pt-1">
                        {item.neutral}
                      </div>
                    )}
                  </div>
                  
                  {/* Negative Bar */}
                  <div 
                    className={`w-full bg-gradient-to-t from-red-500 to-red-400 rounded-b transition-all duration-300 ${
                      isHovered ? 'opacity-100 shadow-lg scale-105' : 'opacity-80'
                    }`}
                    style={{ height: `${negativeHeight}%` }}
                  >
                    {negativeHeight > 10 && (
                      <div className="text-white text-[10px] sm:text-xs font-semibold text-center pt-1">
                        {item.negative}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Date Label */}
                <span className={`text-[10px] sm:text-xs text-center transition-all duration-300 ${
                  isHovered ? 'text-gray-900 font-semibold' : 'text-gray-500'
                }`}>
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.positive, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Total Positive</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-yellow-600">
              {data.reduce((sum, item) => sum + item.neutral, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Total Neutral</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-red-600">
              {data.reduce((sum, item) => sum + item.negative, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Total Negative</div>
          </div>
        </div>
      </div>
    </div>
  );
};