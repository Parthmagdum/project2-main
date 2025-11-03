import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FeedbackItem } from '../../types';

interface FeedbackCardProps {
  feedback: FeedbackItem;
  onViewDetails: (feedback: FeedbackItem) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onViewDetails }) => {
  const getSentimentIcon = () => {
    switch (feedback.sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSentimentColor = () => {
    switch (feedback.sentiment) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  const getUrgencyBadge = () => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[feedback.urgency]}`}>
        {feedback.urgency.toUpperCase()}
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${getSentimentColor()} p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer`}
         onClick={() => onViewDetails(feedback)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getSentimentIcon()}
          <span className="font-medium text-gray-900">{feedback.courseName}</span>
          {feedback.flagged && <AlertTriangle className="h-4 w-4 text-red-500" />}
        </div>
        <div className="flex items-center space-x-2">
          {getUrgencyBadge()}
          <span className="text-xs text-gray-500">
            {feedback.submittedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {feedback.text}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="space-x-4">
          <span>Instructor: {feedback.instructor}</span>
          <span>Dept: {feedback.department}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Confidence: {(feedback.sentimentConfidence * 100).toFixed(0)}%</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{feedback.topics.length} topics</span>
        </div>
      </div>
    </div>
  );
};