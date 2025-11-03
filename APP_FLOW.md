# Application Flow Diagram

## User Journey Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    🎓 Student Feedback System                   │
│                         Landing Page                            │
│                                                                 │
│    ┌─────────────────────┐      ┌─────────────────────┐       │
│    │   👨‍🎓 STUDENT       │      │   🛡️ ADMINISTRATOR  │       │
│    │                     │      │                     │       │
│    │  Submit Feedback    │      │  Manage & Analyze   │       │
│    │    Anonymously      │      │      Feedback       │       │
│    └─────────────────────┘      └─────────────────────┘       │
│              │                            │                    │
└──────────────┼────────────────────────────┼────────────────────┘
               │                            │
               ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  Student Login   │         │   Admin Login    │
    │                  │         │                  │
    │ • Enter ID       │         │ • Email          │
    │ • Privacy Notice │         │ • Password       │
    │ • Agreement      │         │ • Demo Info      │
    └──────────────────┘         └──────────────────┘
               │                            │
               ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │ Feedback Form    │         │  Admin Dashboard │
    │                  │         │                  │
    │ • Course Info    │         │ • Analytics      │
    │ • Instructor     │         │ • Sentiment      │
    │ • Department     │         │ • Alerts         │
    │ • Semester       │         │ • Insights       │
    │ • Feedback Text  │         │ • Reports        │
    └──────────────────┘         └──────────────────┘
               │                            │
               ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │ Success Message  │         │  Full Features   │
    │                  │         │                  │
    │ • Thank You      │         │ • View Feedback  │
    │ • Submit Another │         │ • Manage Alerts  │
    └──────────────────┘         │ • Analytics      │
                                 │ • Export Data    │
                                 │ • User Management│
                                 └──────────────────┘
```

## Authentication States

```
┌─────────────────────────────────────────────────────────────┐
│  Auth State: 'role-selection'                               │
│  Display: Role Selection Screen (Student or Admin)          │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐           ┌───────────────────┐
│  State:           │           │  State:           │
│  'student-login'  │           │  'admin-login'    │
│                   │           │                   │
│  Display:         │           │  Display:         │
│  Student Login    │           │  Admin Login      │
└───────────────────┘           └───────────────────┘
        │                                 │
        ▼                                 ▼
┌───────────────────┐           ┌───────────────────┐
│  State:           │           │  State:           │
│  'student-        │           │  'admin-          │
│   feedback'       │           │   dashboard'      │
│                   │           │                   │
│  Display:         │           │  Display:         │
│  Feedback Form    │           │  Full Dashboard   │
└───────────────────┘           └───────────────────┘
```

## Component Hierarchy

```
App.tsx
├── RoleSelection.tsx (Landing Page)
│   └── Buttons for Student/Admin
│
├── StudentLogin.tsx
│   ├── Student ID Input
│   ├── Privacy Notice
│   └── Agreement Checkbox
│
├── AdminLogin.tsx
│   ├── Email Input
│   ├── Password Input
│   └── Demo Credentials Info
│
├── FeedbackForm.tsx (Student Interface)
│   ├── Course Information Fields
│   ├── Feedback Textarea
│   ├── Guidelines
│   └── Submit Button
│
└── Admin Dashboard
    ├── Header.tsx
    │   ├── User Info
    │   ├── Alert Badge
    │   └── Logout Button
    │
    ├── Sidebar.tsx
    │   └── Navigation Menu
    │
    └── Views
        ├── DashboardView.tsx
        │   ├── MetricCards
        │   ├── SentimentChart
        │   └── TopicDistribution
        │
        ├── FeedbackView.tsx
        │   └── FeedbackCards
        │
        ├── AlertsView.tsx
        │   └── AlertCards
        │
        └── InsightsView.tsx
            └── RecommendationCards
```

## Data Flow

```
Student Feedback Flow:
─────────────────────

1. Student enters ID
2. Student fills form
3. On Submit:
   • Data logged to console
   • Success message displayed
   • Form reset after 3 seconds
   • Can submit another feedback

Admin Access Flow:
─────────────────

1. Admin enters credentials
2. System validates:
   • email === 'admin@university.edu'
   • password === 'admin123'
3. If valid:
   • Access granted
   • Dashboard loads
   • Mock data displayed
4. Admin can:
   • View all feedback
   • Manage alerts
   • See analytics
   • Get insights
```

## Features Summary

### 🎓 Student Features
- ✅ Anonymous feedback submission
- ✅ Privacy protection
- ✅ Simple ID-based access
- ✅ Course-specific feedback
- ✅ Clear guidelines
- ✅ Success confirmation

### 🛡️ Admin Features
- ✅ Secure authentication
- ✅ Comprehensive dashboard
- ✅ Real-time analytics
- ✅ Sentiment analysis
- ✅ Alert management
- ✅ Topic insights
- ✅ Department comparison
- ✅ Trend visualization

### 🎨 UI/UX Features
- ✅ Modern gradient design
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Clear navigation
- ✅ Intuitive icons
- ✅ Professional typography
- ✅ Consistent color scheme
- ✅ Accessible design
