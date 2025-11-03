import React from 'react';
import { Bell, Settings, User, LogOut, Search } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  alertCount: number;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, alertCount, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Feedback Analytics
          </h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {user.department}
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
            {alertCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </div>
          
          <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="relative">
              <User className="h-8 w-8 text-gray-600 bg-gray-100 rounded-full p-1 cursor-pointer hover:bg-gray-200 transition-colors" />
            </div>
            <LogOut 
              className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" 
              onClick={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};