import React from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { MetricCard } from '../components/Dashboard/MetricCard';
import { SentimentChart } from '../components/Dashboard/SentimentChart';
import { TopicDistribution } from '../components/Dashboard/TopicDistribution';
import { AnalyticsData, Alert } from '../types';

interface DashboardViewProps {
  analytics: AnalyticsData;
  alerts: Alert[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ analytics, alerts }) => {
  const openAlertsCount = alerts.filter(alert => alert.status === 'open').length;
  const processingRate = ((analytics.processedFeedback / analytics.totalFeedback) * 100).toFixed(1);
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time insights into student feedback and system performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Feedback Received"
          value={analytics.totalFeedback.toLocaleString()}
          change="+12% this week"
          changeType="positive"
          icon={MessageSquare}
          iconColor="text-blue-600"
        />
        
        <MetricCard
          title="Processing Rate"
          value={`${processingRate}%`}
          change="+3.2% improvement"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        
        <MetricCard
          title="Active Alerts"
          value={openAlertsCount}
          change={openAlertsCount > 5 ? "Attention needed" : "Under control"}
          changeType={openAlertsCount > 5 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        
        <MetricCard
          title="Average Sentiment"
          value={analytics.averageSentiment > 0 ? `+${(analytics.averageSentiment * 100).toFixed(1)}%` : `${(analytics.averageSentiment * 100).toFixed(1)}%`}
          change={analytics.averageSentiment > 0.2 ? "Positive trend" : "Needs attention"}
          changeType={analytics.averageSentiment > 0.2 ? "positive" : "negative"}
          icon={Users}
          iconColor="text-purple-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart data={analytics.sentimentTrends} />
        <TopicDistribution data={analytics.topicDistribution} />
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {alerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {alert.status === 'resolved' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-orange-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {alert.type.replace('_', ' ').toUpperCase()} alert
                </p>
                <p className="text-xs text-gray-500">{alert.description}</p>
              </div>
              <div className="text-xs text-gray-400">
                {alert.createdAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};