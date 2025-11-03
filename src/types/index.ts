export interface FeedbackItem {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  instructor: string;
  department: string;
  semester: string;
  submittedAt: Date;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  sentimentConfidence: number;
  topics: TopicClassification[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  flagged: boolean;
  processed: boolean;
}

export interface TopicClassification {
  topic: 'teaching_style' | 'course_content' | 'infrastructure' | 'assessment_methods' | 'classroom_environment' | 'support_services';
  confidence: number;
  keywords: string[];
}

export interface Alert {
  id: string;
  feedbackId: string;
  type: 'harassment' | 'discrimination' | 'safety' | 'mental_health' | 'academic_integrity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: Date;
  assignedTo?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'staff' | 'department_head';
  department?: string;
  permissions: string[];
}

export interface InsightRecommendation {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string[];
  frequency: number;
  sentimentImpact: number;
  actionItems: string[];
  affectedCourses: string[];
}

export interface AnalyticsData {
  totalFeedback: number;
  processedFeedback: number;
  averageSentiment: number;
  alertsGenerated: number;
  topicDistribution: { [key: string]: number };
  sentimentTrends: { date: string; positive: number; negative: number; neutral: number }[];
  departmentComparison: { department: string; sentiment: number; count: number }[];
}