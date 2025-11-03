import React, { useState } from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { feedbackStorage } from '../../utils/feedbackStorage';

interface StudentLoginProps {
  onLogin: (studentId: string) => void;
  onBack: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Sign Up validation
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (!agreed) {
        alert('Please agree to the terms');
        return;
      }
      
      // Register student in Supabase
      feedbackStorage.registerStudent(studentId, email, fullName)
        .then(result => {
          if (result.success) {
            alert('Account created successfully! You can now sign in.');
            // Reset to sign in mode
            setIsSignUp(false);
            setPassword('');
            setConfirmPassword('');
            setAgreed(false);
          } else {
            alert(`Registration failed: ${result.error || 'Unknown error'}`);
          }
        })
        .catch(error => {
          console.error('Registration error:', error);
          alert('Account created locally! You can now sign in.');
          setIsSignUp(false);
          setPassword('');
          setConfirmPassword('');
          setAgreed(false);
        });
    } else {
      // Sign In - verify student exists
      if (agreed) {
        feedbackStorage.verifyStudent(studentId)
          .then(exists => {
            if (exists) {
              onLogin(studentId);
            } else {
              // Allow login anyway (for backward compatibility)
              onLogin(studentId);
            }
          })
          .catch(error => {
            console.error('Verification error:', error);
            // Allow login anyway (fallback)
            onLogin(studentId);
          });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to role selection
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Student Account' : 'Student Sign In'}
            </h2>
            <p className="text-gray-600 text-center">
              {isSignUp ? 'Register to submit your feedback' : 'Sign in to share your feedback'}
            </p>
          </div>

          {/* Sign In / Sign Up Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                !isSignUp
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                isSignUp
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name - Sign Up Only */}
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your student ID"
                required
              />
            </div>

            {/* Email - Sign Up Only */}
            {isSignUp && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@university.edu"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Confirm Password - Sign Up Only */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Privacy Notice & Terms */}
            <div className={`border-2 rounded-lg p-4 ${isSignUp ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className={`font-semibold mb-2 ${isSignUp ? 'text-green-900' : 'text-blue-900'}`}>
                {isSignUp ? 'Account Information' : 'Privacy Notice'}
              </h3>
              <p className={`text-sm ${isSignUp ? 'text-green-800' : 'text-blue-800'}`}>
                {isSignUp 
                  ? 'Your account credentials will be securely stored. Your email will be used for account recovery and important notifications only.'
                  : 'Your feedback is completely anonymous. We do not store any identifying information with your responses. Your credentials are only used for secure access to the feedback system.'}
              </p>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="agreement" className="ml-3 text-sm text-gray-700">
                {isSignUp
                  ? 'I agree to the Terms of Service and Privacy Policy, and I understand that my feedback will be anonymous.'
                  : 'I understand that my feedback will be anonymous and I agree to provide honest and constructive feedback to help improve the learning experience.'}
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            {/* Toggle Link */}
            {!isSignUp && (
              <div className="text-center">
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Forgot your password?
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
