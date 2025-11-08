import React from 'react';
import { FeedbackItem } from '../../types';

interface FeedbackCardProps {
  feedback: FeedbackItem;
  onViewDetails: (feedback: FeedbackItem) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onViewDetails }) => {
  const isAnonymous = feedback.isAnonymous || false; // ✅ Use the isAnonymous flag
  
  const getSentimentIcon = () => {
    switch (feedback.sentiment) {
      case 'positive': return <i className="bi bi-trending-up text-green-600"></i>;
      case 'negative': return <i className="bi bi-trending-down text-red-600"></i>;
      default: return <i className="bi bi-dash text-yellow-600"></i>;
    }
  };

  const getSentimentColor = () => {
    switch (feedback.sentiment) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${getSentimentColor()} p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer`}
         onClick={() => onViewDetails(feedback)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getSentimentIcon()}
          {!isAnonymous && (
            <span className="font-medium text-gray-900">{feedback.courseName}</span>
          )}
          {isAnonymous && (
            <span className="font-medium text-gray-900">Anonymous Feedback</span>
          )}
          {feedback.flagged && <i className="bi bi-exclamation-triangle text-red-500"></i>}
          {isAnonymous && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
              Anonymous
            </span>
          )}
          {/* Display Overall Rating */}
          {feedback.overallRating && feedback.overallRating > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
              <i className="bi bi-star-fill text-yellow-500 text-xs"></i>
              <span className="text-xs font-semibold text-yellow-700">{feedback.overallRating}/5</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {feedback.submittedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {feedback.text}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        {!isAnonymous ? (
          <div className="space-x-4">
            <span>Instructor: {feedback.instructor}</span>
            <span>Dept: {feedback.department}</span>
            {feedback.className && <span>Class: {feedback.className}</span>}
          </div>
        ) : (
          <div className="text-gray-400 italic">
            <span>Course details hidden for privacy</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <span>Confidence: {(feedback.sentimentConfidence * 100).toFixed(0)}%</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{feedback.topics.length} topics</span>
        </div>
      </div>
    </div>
  );
};