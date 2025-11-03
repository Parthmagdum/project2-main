import React from 'react';
import { GraduationCap, Shield } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'student' | 'admin') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Student Feedback System
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Login */}
          <button
            onClick={() => onSelectRole('student')}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Student</h2>
              <p className="text-gray-600 mb-6">
                Submit your course feedback anonymously and help improve the learning experience
              </p>
              <div className="inline-flex items-center text-blue-600 font-semibold">
                Continue as Student
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Admin Login */}
          <button
            onClick={() => onSelectRole('admin')}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Administrator</h2>
              <p className="text-gray-600 mb-6">
                Access the dashboard to analyze feedback, manage alerts, and gain insights
              </p>
              <div className="inline-flex items-center text-purple-600 font-semibold">
                Continue as Admin
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
