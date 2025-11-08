import React, { useState, useEffect } from 'react';
import { feedbackStorage } from '../../utils/feedbackStorage';
import { FeedbackItem } from '../../types';

interface StudentDashboardProps {
  studentId: string;
  onLogout: () => void;
  onSubmitNew: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  studentId, 
  onLogout,
  onSubmitNew 
}) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [topicFilter, setTopicFilter] = useState<'all' | 'teaching_style' | 'course_content' | 'infrastructure' | 'assessment_methods' | 'classroom_environment' | 'support_services'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    console.log('🔄 StudentDashboard mounted/updated - Loading feedback for:', studentId);
    loadFeedback();
    // Auto-refresh every 30 seconds to check for new replies
    const interval = setInterval(() => {
      loadFeedback(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [studentId]);

  const loadFeedback = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    const studentFeedback = await feedbackStorage.getStudentFeedback(studentId);
    console.log(`📊 Loaded ${studentFeedback.length} feedback items for student ${studentId}`);
    setFeedback(studentFeedback);
    
    if (!silent) setLoading(false);
    else setRefreshing(false);
  };

  const handleRefresh = () => {
    loadFeedback();
  };

  const handleReplyToFaculty = (feedbackId: string) => {
    setReplyingTo(feedbackId);
    const item = feedback.find(f => f.id === feedbackId);
    setReplyText(item?.studentReply || '');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = async (feedbackId: string) => {
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    const result = await feedbackStorage.saveStudentReply(feedbackId, replyText.trim());
    
    if (result.success) {
      await loadFeedback();
      setReplyingTo(null);
      setReplyText('');
      alert('Reply sent successfully!');
    } else {
      alert('Error sending reply: ' + (result.error || 'Unknown error'));
    }
    setSubmittingReply(false);
  };

  const handleDeleteFeedback = async (feedbackId: string, feedbackText: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this feedback?\n\n"${feedbackText.substring(0, 100)}${feedbackText.length > 100 ? '...' : ''}"\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    const result = await feedbackStorage.deleteFeedback(feedbackId);
    
    if (result.success) {
      await loadFeedback();
      alert('Feedback deleted successfully!');
    } else {
      alert('Error deleting feedback: ' + (result.error || 'Unknown error'));
    }
  };

  const handleEditFeedback = (feedbackId: string, currentText: string) => {
    setEditingFeedback(feedbackId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setEditText('');
  };

  const handleSaveEdit = async (feedbackId: string) => {
    if (!editText.trim()) {
      alert('Feedback text cannot be empty');
      return;
    }

    setSavingEdit(true);
    const result = await feedbackStorage.updateFeedback(feedbackId, editText.trim());
    
    if (result.success) {
      await loadFeedback();
      setEditingFeedback(null);
      setEditText('');
      alert('Feedback updated successfully!');
    } else {
      alert('Error updating feedback: ' + (result.error || 'Unknown error'));
    }
    setSavingEdit(false);
  };

  // Filter and sort feedback
  const filteredFeedback = feedback
    .filter(item => {
      // Filter by sentiment
      const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
      // Filter by topic
      const matchesTopic = topicFilter === 'all' || item.topics.some(t => t.topic === topicFilter);
      return matchesSentiment && matchesTopic;
    })
    .sort((a, b) => {
      // Sort by sentiment first (positive > neutral > negative)
      const sentimentOrder = { positive: 0, neutral: 1, negative: 2 };
      const sentimentDiff = sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment];
      if (sentimentDiff !== 0) return sentimentDiff;
      // Then by date (newest first)
      return b.submittedAt.getTime() - a.submittedAt.getTime();
    });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <i className="bi bi-check-circle-fill text-lg"></i>;
      case 'negative': return <i className="bi bi-exclamation-circle-fill text-lg"></i>;
      default: return <i className="bi bi-chat-square-text-fill text-lg"></i>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Feedback</h1>
              <p className="text-sm text-gray-600 mt-1">
                Student ID: {studentId}
                {feedback.length > 0 && (
                  <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {feedback.length} Total Feedback (All Loaded ∞)
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh to check for new replies"
              >
                <i className={`bi bi-arrow-clockwise ${refreshing ? 'animate-spin' : ''}`}></i>
                Refresh
              </button>
              <button
                onClick={onSubmitNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Submit New Feedback
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <i className="bi bi-chat-square-text text-gray-400 mx-auto mb-4" style={{ fontSize: '4rem' }}></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any feedback yet.</p>
            <button
              onClick={onSubmitNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Your First Feedback
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info Banner - All Feedback Displayed */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <i className="bi bi-check-circle-fill text-blue-600 mt-0.5 flex-shrink-0 text-xl"></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 text-lg">
                    ✨ All Your Feedback is Displayed Below
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Total Feedback Submitted:</strong> <span className="font-bold text-blue-900">{feedback.length}</span> {' '}
                    | <strong>Currently Showing:</strong> <span className="font-bold text-blue-900">{filteredFeedback.length}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    📋 <strong>No Limits:</strong> This page displays ALL your feedback from the beginning. 
                    {feedback.length >= 30 && (
                      <span className="ml-1 text-green-700 font-medium">
                        ({feedback.length} feedback loaded - no pagination needed!)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Complete Feedback History
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: <span className="font-semibold text-blue-600">{feedback.length}</span> feedback
                    {filteredFeedback.length < feedback.length && (
                      <span className="text-orange-600 ml-2">
                        • Showing {filteredFeedback.length} (filters active)
                      </span>
                    )}
                    {filteredFeedback.length === feedback.length && feedback.length > 0 && (
                      <span className="text-green-600 ml-2">
                        • Showing all {filteredFeedback.length} feedback (∞ infinite scroll)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-funnel text-gray-400"></i>
                    <select
                      value={sentimentFilter}
                      onChange={(e) => setSentimentFilter(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Sentiments</option>
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={topicFilter}
                      onChange={(e) => setTopicFilter(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="teaching_style">Teaching Style</option>
                      <option value="course_content">Course Content</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="assessment_methods">Assessment Methods</option>
                      <option value="classroom_environment">Classroom Environment</option>
                      <option value="support_services">Support Services</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    {feedback.filter(f => f.facultyReply).length > 0 && (
                      <span className="text-purple-600 font-medium">
                        {feedback.filter(f => f.facultyReply).length} with faculty reply
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alert if filters are hiding feedback */}
            {filteredFeedback.length === 0 && feedback.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="bi bi-exclamation-circle-fill text-orange-600 mt-0.5 flex-shrink-0 text-lg"></i>
                  <div>
                    <h3 className="font-semibold text-orange-900">No feedback matches your filters</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      You have {feedback.length} total feedback, but none match the current filters. 
                      Try resetting the filters to "All Sentiments" and "All Categories" to see all your feedback.
                    </p>
                    <button
                      onClick={() => {
                        setSentimentFilter('all');
                        setTopicFilter('all');
                      }}
                      className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6">
              {filteredFeedback.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.courseName}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                          <span>{item.department}</span>
                          {item.year && (
                            <>
                              <span>•</span>
                              <span>
                                {item.year === '1' ? 'FE' :
                                 item.year === '2' ? 'SE' :
                                 item.year === '3' ? 'TE' :
                                 item.year === '4' ? 'BE' : `Year ${item.year}`}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>Sem {item.semester}</span>
                          {item.className && (
                            <>
                              <span>•</span>
                              <span>{item.className}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.facultyReply && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            <i className="bi bi-chat-square-text" style={{ fontSize: '0.75rem' }}></i>
                            Replied
                          </div>
                        )}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getSentimentColor(item.sentiment)}`}>
                          {getSentimentIcon(item.sentiment)}
                          <span className="text-sm font-medium capitalize">{item.sentiment}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 py-4">
                    {/* Topic Categories */}
                    {item.topics && item.topics.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200"
                          >
                            {topic.topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Overall Rating Display */}
                    {item.overallRating && (
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`bi ${star <= item.overallRating! ? 'bi-star-fill' : 'bi-star'} ${
                                star <= item.overallRating! ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              style={{ fontSize: '1rem' }}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {item.overallRating}/5
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Your Feedback:</h4>
                        {/* Edit and Delete buttons */}
                        <div className="flex gap-2">
                          {/* Only allow editing if faculty hasn't replied */}
                          {!item.facultyReply && (
                            <button
                              onClick={() => handleEditFeedback(item.id, item.text)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit feedback"
                            >
                              <i className="bi bi-pencil-square" style={{ fontSize: '0.75rem' }}></i>
                              Edit
                            </button>
                          )}
                          {/* Allow delete even after faculty reply */}
                          <button
                            onClick={() => handleDeleteFeedback(item.id, item.text)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete feedback"
                          >
                            <i className="bi bi-trash3" style={{ fontSize: '0.75rem' }}></i>
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Show edit form or feedback text */}
                      {editingFeedback === item.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Edit your feedback..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              disabled={savingEdit || !editText.trim()}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <i className="bi bi-check-lg" style={{ fontSize: '0.75rem' }}></i>
                              {savingEdit ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              <i className="bi bi-x inline mr-1" style={{ fontSize: '0.75rem' }}></i>
                              Cancel
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            💡 Note: Editing will re-analyze sentiment and topics based on your new text.
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-800 leading-relaxed">{item.text}</p>
                      )}
                    </div>

                    {/* Faculty Reply */}
                    {item.facultyReply ? (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <i className="bi bi-chat-square-text-fill text-purple-600"></i>
                            <h4 className="text-sm font-semibold text-purple-900">Faculty Response:</h4>
                          </div>
                          <p className="text-gray-800 leading-relaxed">{item.facultyReply}</p>
                          {item.replyAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Replied on {new Date(item.replyAt).toLocaleDateString()} at{' '}
                              {new Date(item.replyAt).toLocaleTimeString()}
                            </p>
                          )}

                          {/* Student Reply Section */}
                          {item.studentReply ? (
                            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                              <p className="text-sm font-medium text-blue-900 mb-1">Your Reply:</p>
                              <p className="text-gray-800 text-sm">{item.studentReply}</p>
                              {item.studentReplyAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Sent on {new Date(item.studentReplyAt).toLocaleDateString()} at{' '}
                                  {new Date(item.studentReplyAt).toLocaleTimeString()}
                                </p>
                              )}
                              <button
                                onClick={() => handleReplyToFaculty(item.id)}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Edit Reply
                              </button>
                            </div>
                          ) : replyingTo === item.id ? (
                            <div className="mt-3 space-y-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply to faculty..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSubmitReply(item.id)}
                                  disabled={submittingReply || !replyText.trim()}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <i className="bi bi-send" style={{ fontSize: '0.75rem' }}></i>
                                  {submittingReply ? 'Sending...' : 'Send Reply'}
                                </button>
                                <button
                                  onClick={handleCancelReply}
                                  className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleReplyToFaculty(item.id)}
                              className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <i className="bi bi-send"></i>
                              Reply to Faculty
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500">
                            ⏳ Awaiting faculty response...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                      <i className="bi bi-clock"></i>
                      <span>
                        Submitted on {new Date(item.submittedAt).toLocaleDateString()} at{' '}
                        {new Date(item.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Footer - Confirmation All Loaded */}
            {filteredFeedback.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <i className="bi bi-check-circle-fill text-green-600 text-lg"></i>
                  <p className="text-sm text-green-800 font-medium">
                    ✅ End of List - All {filteredFeedback.length} feedback items loaded successfully
                  </p>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  {filteredFeedback.length === feedback.length 
                    ? `No limits applied - showing your complete feedback history (${feedback.length} total)`
                    : `Filters are active - ${feedback.length - filteredFeedback.length} feedback hidden by filters`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
