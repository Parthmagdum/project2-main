import React from 'react';
import { Lightbulb, TrendingUp, Download } from 'lucide-react';
import { RecommendationCard } from '../components/Insights/RecommendationCard';
import { InsightRecommendation } from '../types';

interface InsightsViewProps {
  recommendations: InsightRecommendation[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ recommendations }) => {
  const highPriority = recommendations.filter(r => r.priority === 'high').length;
  const mediumPriority = recommendations.filter(r => r.priority === 'medium').length;
  const lowPriority = recommendations.filter(r => r.priority === 'low').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Insights & Recommendations</h2>
        <p className="text-gray-600">AI-generated actionable insights based on student feedback analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-800">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1">{highPriority}</div>
          <p className="text-sm text-red-600">Immediate attention required</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium text-yellow-800">Medium Priority</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700 mt-1">{mediumPriority}</div>
          <p className="text-sm text-yellow-600">Plan for implementation</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800">Low Priority</span>
          </div>
          <div className="text-2xl font-bold text-green-700 mt-1">{lowPriority}</div>
          <p className="text-sm text-green-600">Long-term improvements</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Generated Recommendations</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-4 w-4" />
              <span>View Trends</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {recommendations
            .sort((a, b) => {
              const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
        </div>
      </div>
    </div>
  );
};