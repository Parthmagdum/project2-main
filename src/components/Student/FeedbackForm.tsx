import React, { useState } from 'react';
import { Send, LogOut, CheckCircle } from 'lucide-react';

interface FeedbackFormProps {
  studentId: string;
  onLogout: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ studentId, onLogout }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    instructor: '',
    department: '',
    semester: 'Fall 2024',
    feedback: '',
    studentName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate feedback submission
    console.log('Feedback submitted:', {
      ...formData,
      studentId: studentId,
      isAnonymous: isAnonymous,
      submittedAt: new Date()
    });

    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        courseId: '',
        courseName: '',
        instructor: '',
        department: '',
        semester: 'Fall 2024',
        feedback: '',
        studentName: ''
      });
      setIsAnonymous(true);
      setSubmitted(false);
    }, 3000);
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
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. Your input helps us improve the learning experience for everyone.
          </p>
          <button
            onClick={onLogout}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Feedback Form</h1>
            <p className="text-gray-600 mt-2">Your feedback is anonymous and helps improve our courses</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                  Course ID *
                </label>
                <input
                  type="text"
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., CS101"
                  required
                />
              </div>

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
                  required
                />
              </div>

              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Prof. Anderson"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Computer Science"
                  required
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                  <option value="Winter 2024">Winter 2024</option>
                </select>
              </div>
            </div>

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
                Minimum 50 characters. Be specific and constructive in your feedback.
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
                    courseId: '',
                    courseName: '',
                    instructor: '',
                    department: '',
                    semester: 'Fall 2024',
                    feedback: '',
                    studentName: ''
                  });
                  setIsAnonymous(true);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={formData.feedback.length < 50}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
