import React from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { Alert } from '../../types';

interface AlertCardProps {
  alert: Alert;
  onStatusChange: (alertId: string, newStatus: Alert['status']) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onStatusChange }) => {
  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (alert.status) {
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'escalated': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <XCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = () => {
    switch (alert.type) {
      case 'harassment': return 'bg-red-100 text-red-800';
      case 'discrimination': return 'bg-purple-100 text-purple-800';
      case 'safety': return 'bg-orange-100 text-orange-800';
      case 'mental_health': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 ${getSeverityColor()} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">Alert #{alert.id}</h3>
            <p className="text-sm text-gray-500">
              {alert.createdAt.toLocaleDateString()} at {alert.createdAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor()}`}>
            {alert.type.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{alert.description}</p>
      
      {alert.assignedTo && (
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Assigned to: {alert.assignedTo}</span>
        </div>
      )}
      
      {alert.notes && (
        <div className="bg-gray-50 rounded p-3 mb-4">
          <p className="text-sm text-gray-700"><strong>Notes:</strong> {alert.notes}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {alert.status !== 'resolved' && (
            <>
              <button
                onClick={() => onStatusChange(alert.id, 'in_progress')}
                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              >
                In Progress
              </button>
              <button
                onClick={() => onStatusChange(alert.id, 'resolved')}
                className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
              >
                Resolve
              </button>
              <button
                onClick={() => onStatusChange(alert.id, 'escalated')}
                className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors"
              >
                Escalate
              </button>
            </>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Status: <span className="font-medium capitalize">{alert.status.replace('_', ' ')}</span>
        </span>
      </div>
    </div>
  );
};