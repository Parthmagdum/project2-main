import { FeedbackItem, Alert, User, InsightRecommendation, AnalyticsData } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  role: 'admin',
  department: 'Academic Affairs',
  permissions: ['view_all', 'manage_alerts', 'export_data', 'system_admin']
};

export const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    studentId: 'S001',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    instructor: 'Prof. Anderson',
    department: 'Computer Science',
    semester: 'Fall 2024',
    submittedAt: new Date('2024-01-15'),
    text: 'The professor explains concepts very clearly and provides excellent examples. However, the classroom projector often malfunctions, making it difficult to see the code demonstrations.',
    sentiment: 'positive',
    sentimentScore: 0.7,
    sentimentConfidence: 0.85,
    topics: [
      { topic: 'teaching_style', confidence: 0.92, keywords: ['explains', 'clearly', 'excellent', 'examples'] },
      { topic: 'infrastructure', confidence: 0.88, keywords: ['projector', 'malfunctions', 'difficult'] }
    ],
    urgency: 'low',
    flagged: false,
    processed: true
  },
  {
    id: '2',
    studentId: 'S002',
    courseId: 'MATH201',
    courseName: 'Advanced Mathematics',
    instructor: 'Dr. Williams',
    department: 'Mathematics',
    semester: 'Fall 2024',
    submittedAt: new Date('2024-01-16'),
    text: 'I feel completely lost in this class. The instructor seems dismissive when students ask questions and makes inappropriate comments about student abilities.',
    sentiment: 'negative',
    sentimentScore: -0.8,
    sentimentConfidence: 0.91,
    topics: [
      { topic: 'teaching_style', confidence: 0.89, keywords: ['dismissive', 'inappropriate', 'comments'] },
      { topic: 'support_services', confidence: 0.76, keywords: ['lost', 'questions'] }
    ],
    urgency: 'high',
    flagged: true,
    processed: true
  },
  {
    id: '3',
    studentId: 'S003',
    courseId: 'ENG105',
    courseName: 'English Composition',
    instructor: 'Prof. Davis',
    department: 'English',
    semester: 'Fall 2024',
    submittedAt: new Date('2024-01-17'),
    text: 'The course content is relevant and engaging. The writing assignments help develop critical thinking skills effectively.',
    sentiment: 'positive',
    sentimentScore: 0.85,
    sentimentConfidence: 0.87,
    topics: [
      { topic: 'course_content', confidence: 0.94, keywords: ['relevant', 'engaging', 'effectively'] },
      { topic: 'assessment_methods', confidence: 0.82, keywords: ['assignments', 'critical thinking'] }
    ],
    urgency: 'low',
    flagged: false,
    processed: true
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'A001',
    feedbackId: '2',
    type: 'harassment',
    severity: 'high',
    description: 'Student reports dismissive behavior and inappropriate comments from instructor',
    createdAt: new Date('2024-01-16'),
    assignedTo: 'Dr. Sarah Johnson',
    status: 'in_progress',
    notes: 'Contacted department head. Meeting scheduled with instructor.'
  },
  {
    id: 'A002',
    feedbackId: '4',
    type: 'mental_health',
    severity: 'medium',
    description: 'Student feedback contains indicators of academic stress and anxiety',
    createdAt: new Date('2024-01-18'),
    status: 'open'
  }
];

export const mockRecommendations: InsightRecommendation[] = [
  {
    id: 'R001',
    category: 'Infrastructure',
    priority: 'high',
    title: 'Upgrade Classroom Technology Equipment',
    description: 'Multiple reports indicate malfunctioning projectors and audio equipment affecting learning quality.',
    evidence: [
      '15 reports of projector malfunctions across 8 classrooms',
      'Audio issues reported in 6 different courses',
      'Student satisfaction decreased by 23% in affected classrooms'
    ],
    frequency: 15,
    sentimentImpact: -0.4,
    actionItems: [
      'Conduct comprehensive audit of classroom technology',
      'Replace outdated projectors in high-usage classrooms',
      'Implement preventive maintenance schedule'
    ],
    affectedCourses: ['CS101', 'PHYS201', 'CHEM301']
  },
  {
    id: 'R002',
    category: 'Teaching Methods',
    priority: 'medium',
    title: 'Enhance Question-Answering Protocols',
    description: 'Students report feeling dismissed when asking questions, impacting learning engagement.',
    evidence: [
      '8 reports of dismissive instructor behavior',
      'Decreased class participation noted in affected courses',
      'Student confidence scores below department average'
    ],
    frequency: 8,
    sentimentImpact: -0.6,
    actionItems: [
      'Provide professional development on inclusive teaching practices',
      'Establish clear protocols for student question handling',
      'Implement peer observation program'
    ],
    affectedCourses: ['MATH201', 'PHYS301']
  }
];

export const mockAnalytics: AnalyticsData = {
  totalFeedback: 1247,
  processedFeedback: 1183,
  averageSentiment: 0.32,
  alertsGenerated: 23,
  topicDistribution: {
    teaching_style: 312,
    course_content: 298,
    infrastructure: 156,
    assessment_methods: 201,
    classroom_environment: 178,
    support_services: 102
  },
  sentimentTrends: [
    { date: '2024-01-01', positive: 45, negative: 23, neutral: 32 },
    { date: '2024-01-02', positive: 52, negative: 18, neutral: 30 },
    { date: '2024-01-03', positive: 48, negative: 25, neutral: 27 },
    { date: '2024-01-04', positive: 55, negative: 20, neutral: 25 },
    { date: '2024-01-05', positive: 50, negative: 22, neutral: 28 }
  ],
  departmentComparison: [
    { department: 'Computer Science', sentiment: 0.45, count: 156 },
    { department: 'Mathematics', sentiment: 0.12, count: 134 },
    { department: 'English', sentiment: 0.67, count: 98 },
    { department: 'Physics', sentiment: 0.23, count: 112 },
    { department: 'Chemistry', sentiment: 0.38, count: 87 }
  ]
};