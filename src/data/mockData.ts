import { FeedbackItem, Alert, User, InsightRecommendation, AnalyticsData } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  role: 'admin',
  department: 'Academic Affairs',
  permissions: ['view_all', 'manage_alerts', 'export_data', 'system_admin']
};

export const mockFeedback: FeedbackItem[] = [];

export const mockAlerts: Alert[] = [];

export const mockRecommendations: InsightRecommendation[] = [];

export const mockAnalytics: AnalyticsData = {
  totalFeedback: 0,
  processedFeedback: 0,
  averageSentiment: 0,
  alertsGenerated: 0,
  topicDistribution: {
    teaching_style: 0,
    course_content: 0,
    infrastructure: 0,
    assessment_methods: 0,
    classroom_environment: 0,
    support_services: 0
  },
  sentimentTrends: [],
  departmentComparison: []
};