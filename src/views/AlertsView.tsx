import React, { useState } from 'react';
import { AlertTriangle, Filter, Clock, CheckCircle } from 'lucide-react';
import { AlertCard } from '../components/Alerts/AlertCard';
import { Alert } from '../types';

interface AlertsViewProps {
  alerts: Alert[];
  onUpdateAlert: (alertId: string, newStatus: Alert['status']) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onUpdateAlert }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const getStatusStats = () => {
    const stats = alerts.reduce((acc, alert) => {
      acc[alert.status] = (acc[alert.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Alert Management</h2>
        <p className="text-gray-600">Monitor and respond to urgent feedback requiring immediate attention</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-gray-900">Open</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {stats.open || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {stats.in_progress || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {stats.resolved || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-900">Escalated</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {stats.escalated || 0}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
          
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </div>
        
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onStatusChange={onUpdateAlert}
            />
          ))}
        </div>
      </div>
    </div>
  );
};