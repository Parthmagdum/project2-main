import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InsightRecommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: InsightRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getPriorityIcon = () => {
    switch (recommendation.priority) {
      case 'high': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'medium': return <TrendingUp className="h-5 w-5 text-yellow-600" />;
      default: return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 ${getPriorityColor()} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getPriorityIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
            <p className="text-sm text-gray-500">{recommendation.category}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{recommendation.frequency} reports</div>
          <div className="text-xs text-gray-500">
            Impact: {recommendation.sentimentImpact > 0 ? '+' : ''}{(recommendation.sentimentImpact * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{recommendation.description}</p>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Evidence:</h4>
        <ul className="space-y-1">
          {recommendation.evidence.map((evidence, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
              <span className="text-gray-400 mt-1.5">•</span>
              <span>{evidence}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
        <ul className="space-y-1">
          {recommendation.actionItems.map((action, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          <span>Affected Courses: </span>
          <span className="font-medium">{recommendation.affectedCourses.join(', ')}</span>
        </div>
        <span className={`px-2 py-1 rounded-full font-medium ${
          recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
          recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {recommendation.priority.toUpperCase()} PRIORITY
        </span>
      </div>
    </div>
  );
};