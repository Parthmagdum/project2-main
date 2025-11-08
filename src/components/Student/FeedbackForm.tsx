import React, { useState } from 'react';
import { feedbackStorage } from '../../utils/feedbackStorage';
import { classifyFeedbackWithGemini } from '../../utils/geminiApi';
import { FeedbackItem } from '../../types';

interface FeedbackFormProps {
  studentId: string;
  onLogout: () => void;
  onBack?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ studentId, onLogout, onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    courseName: '',
    department: '',
    semester: '1',
    year: '1',
    className: '',
    feedback: '',
    studentName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use Gemini API for classification
      console.log('🤖 Classifying feedback with Gemini API...');
      const classification = await classifyFeedbackWithGemini(formData.feedback);
      
      // Create feedback item - ALWAYS store real student ID
      const feedbackItem: FeedbackItem = {
        id: `FB_${Date.now()}`,
        studentId: studentId, // ✅ ALWAYS store real student ID (even for anonymous)
        courseId: 'N/A',
        courseName: isAnonymous ? 'N/A' : formData.courseName,
        instructor: 'N/A',
        department: isAnonymous ? 'N/A' : formData.department,
        semester: isAnonymous ? 'N/A' : formData.semester,
        year: isAnonymous ? undefined : formData.year, // ✅ Store year
        className: isAnonymous ? undefined : formData.className, // ✅ Store class/section
        submittedAt: new Date(),
        text: formData.feedback,
        sentiment: classification.sentiment,
        sentimentScore: classification.sentimentScore,
        sentimentConfidence: Math.abs(classification.sentimentScore),
        topics: classification.topics,
        flagged: classification.sentiment === 'negative' && classification.sentimentScore < -0.5,
        processed: true,
        isAnonymous: isAnonymous, // ✅ Add flag to indicate if this is anonymous
        overallRating: overallRating // ✅ Store the overall rating
      } as any;
    
      // Add student name if not anonymous
      if (!isAnonymous && formData.studentName) {
        (feedbackItem as any).studentName = formData.studentName;
      }
      
      // Save to database/localStorage
      await feedbackStorage.saveFeedback(feedbackItem);
      
      // Log for debugging
      console.log('✅ Feedback submitted with Gemini classification:', feedbackItem);

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          courseName: '',
          department: '',
          semester: '1',
          year: '1',
          className: '',
          feedback: '',
          studentName: ''
        });
        setIsAnonymous(true);
        setOverallRating(0);
        setSubmitted(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="bi bi-check-circle text-green-600" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully{isAnonymous ? ' anonymously' : ' with your name'}. 
            Your input helps us improve the learning experience for everyone.
          </p>
          {!isAnonymous && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                📧 Faculty may reach out to you for follow-up regarding your feedback.
              </p>
            </div>
          )}
          <button
            onClick={onBack || onLogout}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            {onBack ? 'Back to Dashboard' : 'Submit Another Feedback'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <i className="bi bi-arrow-left mr-2"></i>
                Back
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Feedback Form</h1>
              <p className="text-gray-600 mt-2">Your feedback is anonymous and helps improve our courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <i className="bi bi-list-check"></i>
                My Feedback
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="bi bi-box-arrow-right mr-2"></i>
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous/Named Feedback Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
              <h3 className="font-semibold text-blue-900 mb-3 text-lg">Feedback Submission Type</h3>
              <div className="space-y-3">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="radio"
                    name="feedbackType"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(true)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                      🔒 Anonymous Feedback
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Your identity will remain completely confidential. Neither faculty nor administration will know who submitted this feedback.
                    </p>
                  </div>
                </label>
                
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="radio"
                    name="feedbackType"
                    checked={!isAnonymous}
                    onChange={() => setIsAnonymous(false)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                      👤 Include My Name
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Submit feedback with your name. Faculty and administration will be able to identify you and may follow up directly.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Conditional Name Field */}
            {!isAnonymous && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required={!isAnonymous}
                />
                <p className="mt-2 text-xs text-yellow-800">
                  ⚠️ Your name will be visible to faculty and administration with this feedback.
                </p>
              </div>
            )}

            {/* Conditional Course Details - Only for Named Feedback */}
            {!isAnonymous && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Introduction to Computer Science"
                    required={!isAnonymous}
                  />
                </div>

                <div>
                  <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                    Class/Section *
                  </label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., CS-101-A, Section A"
                    required={!isAnonymous}
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    required={!isAnonymous}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science Engineering">Computer Science Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Automobile Engineering">Automobile Engineering</option>
                    <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                    <option value="Biotechnology Engineering">Biotechnology Engineering</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    required={!isAnonymous}
                  >
                    <option value="1">First Year (FE)</option>
                    <option value="2">Second Year (SE)</option>
                    <option value="3">Third Year (TE)</option>
                    <option value="4">Fourth Year (BE)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    required={!isAnonymous}
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Please share your thoughts about the course, teaching style, course content, assessment methods, classroom environment, or any other aspects of your learning experience..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Be specific and constructive in your feedback.
              </p>
            </div>

            {/* Overall Rating with 5 Stars */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 transform hover:scale-110"
                  >
                    <i 
                      className={`bi ${
                        star <= (hoveredRating || overallRating) 
                          ? 'bi-star-fill' 
                          : 'bi-star'
                      }`}
                      style={{ 
                        fontSize: '2.5rem',
                        color: star <= (hoveredRating || overallRating) ? '#fbbf24' : '#d1d5db'
                      }}
                    ></i>
                  </button>
                ))}
              </div>
              <p className="text-center mt-3 text-sm font-medium text-gray-600">
                {overallRating === 0 && 'Click on a star to rate'}
                {overallRating === 1 && '⭐ Poor'}
                {overallRating === 2 && '⭐⭐ Fair'}
                {overallRating === 3 && '⭐⭐⭐ Good'}
                {overallRating === 4 && '⭐⭐⭐⭐ Very Good'}
                {overallRating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </p>
            </div>

            <div className={`border-2 rounded-lg p-4 ${isAnonymous ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <h3 className={`font-semibold mb-2 ${isAnonymous ? 'text-green-900' : 'text-orange-900'}`}>
                {isAnonymous ? '🔒 Submitting Anonymously' : '👤 Submitting with Your Name'}
              </h3>
              <p className={`text-sm mb-3 ${isAnonymous ? 'text-green-800' : 'text-orange-800'}`}>
                {isAnonymous 
                  ? 'Your identity is protected. This feedback cannot be traced back to you.'
                  : 'Your name will be included with this feedback. Faculty may contact you for follow-up.'}
              </p>
              <h4 className={`font-semibold text-sm mb-1 ${isAnonymous ? 'text-green-900' : 'text-orange-900'}`}>
                Guidelines for Feedback:
              </h4>
              <ul className={`text-sm space-y-1 list-disc list-inside ${isAnonymous ? 'text-green-800' : 'text-orange-800'}`}>
                <li>Be honest and constructive</li>
                <li>Focus on specific experiences and examples</li>
                <li>Avoid personal attacks or offensive language</li>
                <li>Mention both positive aspects and areas for improvement</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    courseName: '',
                    department: '',
                    semester: '1',
                    year: '1',
                    className: '',
                    feedback: '',
                    studentName: ''
                  });
                  setIsAnonymous(true);
                  setOverallRating(0);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <i className="bi bi-send mr-2"></i>
                {isSubmitting ? 'Analyzing with AI...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
