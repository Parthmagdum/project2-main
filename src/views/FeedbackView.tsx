import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { FeedbackCard } from '../components/Feedback/FeedbackCard';
import { FeedbackItem } from '../types';

interface FeedbackViewProps {
  feedback: FeedbackItem[];
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
    
    return matchesSearch && matchesSentiment;
  });

  const handleViewDetails = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
  };

  const closeModal = () => {
    setSelectedFeedback(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Analysis</h2>
        <p className="text-gray-600">Analyze and categorize student feedback responses</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredFeedback.length} of {feedback.length} feedback items
        </div>
        
        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <FeedbackCard
              key={item.id}
              feedback={item}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
      
      {/* Modal for detailed view */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Course:</span>
                    <span className="ml-2">{selectedFeedback.courseName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Instructor:</span>
                    <span className="ml-2">{selectedFeedback.instructor}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Department:</span>
                    <span className="ml-2">{selectedFeedback.department}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Sentiment:</span>
                    <span className={`ml-2 capitalize ${
                      selectedFeedback.sentiment === 'positive' ? 'text-green-600' :
                      selectedFeedback.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {selectedFeedback.sentiment}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Feedback Text:</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedFeedback.text}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Topic Classifications:</h4>
                  <div className="space-y-2">
                    {selectedFeedback.topics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="capitalize">{topic.topic.replace('_', ' ')}</span>
                        <span className="text-sm text-gray-600">
                          {(topic.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};