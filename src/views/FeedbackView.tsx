import React, { useState } from 'react';
import { Search, Filter, Download, MessageSquare, Send } from 'lucide-react';
import { FeedbackCard } from '../components/Feedback/FeedbackCard';
import { FeedbackItem } from '../types';
import { feedbackStorage } from '../utils/feedbackStorage';

interface FeedbackViewProps {
  feedback: FeedbackItem[];
  onFeedbackUpdated?: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, onFeedbackUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
    
    return matchesSearch && matchesSentiment;
  });

  const handleViewDetails = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.facultyReply || '');
  };

  const closeModal = () => {
    setSelectedFeedback(null);
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return;

    setIsSubmittingReply(true);
    const result = await feedbackStorage.saveFacultyReply(selectedFeedback.id, replyText.trim());
    
    if (result.success) {
      // Reload feedback first
      if (onFeedbackUpdated) {
        await onFeedbackUpdated();
      }
      alert('Reply submitted successfully!');
      closeModal();
    } else {
      alert('Error submitting reply: ' + (result.error || 'Unknown error'));
    }
    setIsSubmittingReply(false);
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedFeedback.isAnonymous && ( 
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800 font-medium">
                      🔒 This is anonymous feedback. Student identity and course details are protected.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {!selectedFeedback.isAnonymous && (
                    <>
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
                        <span className="font-medium text-gray-700">Semester:</span>
                        <span className="ml-2">{selectedFeedback.semester}</span>
                      </div>
                    </>
                  )}
                  {!selectedFeedback.isAnonymous && (
                    <>
                      <div>
                        <span className="font-medium text-gray-700">Student ID:</span>
                        <span className="ml-2">{selectedFeedback.studentId}</span>
                      </div>
                      {(selectedFeedback as any).studentName && (
                        <div>
                          <span className="font-medium text-gray-700">Student Name:</span>
                          <span className="ml-2">{(selectedFeedback as any).studentName}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Sentiment:</span>
                    <span className={`ml-2 capitalize ${
                      selectedFeedback.sentiment === 'positive' ? 'text-green-600' :
                      selectedFeedback.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {selectedFeedback.sentiment}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <span className="ml-2">{new Date(selectedFeedback.submittedAt).toLocaleDateString()}</span>
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

                {/* Faculty Reply Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Faculty Response
                  </h4>
                  
                  {selectedFeedback.facultyReply && selectedFeedback.replyAt && (
                    <div className="mb-3 bg-purple-50 border border-purple-100 rounded-lg p-3">
                      <p className="text-gray-800 mb-2">{selectedFeedback.facultyReply}</p>
                      <p className="text-xs text-gray-500">
                        Replied on {new Date(selectedFeedback.replyAt).toLocaleDateString()} at{' '}
                        {new Date(selectedFeedback.replyAt).toLocaleTimeString()}
                      </p>

                      {/* Student's Reply to Faculty */}
                      {selectedFeedback.studentReply && (
                        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Student's Reply:</p>
                          <p className="text-gray-800 text-sm">{selectedFeedback.studentReply}</p>
                          {selectedFeedback.studentReplyAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Replied on {new Date(selectedFeedback.studentReplyAt).toLocaleDateString()} at{' '}
                              {new Date(selectedFeedback.studentReplyAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your response to the student..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReply}
                        disabled={isSubmittingReply || !replyText.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmittingReply ? 'Submitting...' : 'Submit Reply'}
                      </button>
                    </div>
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