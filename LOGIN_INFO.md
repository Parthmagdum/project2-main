# Student Feedback System - Login Information

## Overview
This application now features separate login interfaces for students and administrators, with a complete authentication flow.

## Access the Application
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Open your browser to `http://localhost:5173/`

## User Flows

### Student Flow
1. **Role Selection** - Click on "Student" card
2. **Student Login** - Enter any student ID (e.g., "S12345")
3. **Feedback Form** - Complete the feedback form with course information
4. **Submit** - Submit feedback anonymously

### Admin Flow
1. **Role Selection** - Click on "Administrator" card
2. **Admin Login** - Use the demo credentials below
3. **Dashboard** - Access the full admin dashboard with analytics, alerts, and insights

## Demo Account Credentials

### Admin Account
- **Email:** `admin@university.edu`
- **Password:** `admin123`

### Student Access
- **Student ID:** Any alphanumeric ID (e.g., "S12345", "STU001", etc.)
- No password required - students provide feedback anonymously

## Features

### For Students:
- ✅ Anonymous feedback submission
- ✅ User-friendly feedback form
- ✅ Privacy-focused design
- ✅ Course-specific feedback collection
- ✅ Success confirmation after submission

### For Administrators:
- ✅ Secure login with credentials
- ✅ Dashboard with analytics
- ✅ Real-time feedback monitoring
- ✅ Alert management system
- ✅ Sentiment analysis visualization
- ✅ Topic distribution charts
- ✅ Actionable insights and recommendations

## File Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── RoleSelection.tsx    # Initial role selection screen
│   │   ├── AdminLogin.tsx       # Admin login interface
│   │   └── StudentLogin.tsx     # Student login interface
│   ├── Student/
│   │   └── FeedbackForm.tsx     # Student feedback form
│   ├── Dashboard/               # Admin dashboard components
│   ├── Feedback/                # Feedback management
│   ├── Alerts/                  # Alert system
│   └── Insights/                # Analytics and insights
└── App.tsx                      # Main app with auth routing
```

## Security Notes
- This is a **DEMO** implementation
- In production, implement proper authentication (JWT, OAuth, etc.)
- Use secure password hashing
- Implement rate limiting
- Add CSRF protection
- Store credentials securely
- Implement proper session management

## Privacy Considerations
- Student feedback is collected anonymously
- Student IDs are used only for verification (duplicate prevention)
- No identifying information is stored with feedback
- Complies with FERPA requirements for educational institutions

## Next Steps for Production
1. Implement real backend API
2. Add database integration
3. Set up proper authentication system
4. Add email verification
5. Implement password reset functionality
6. Add two-factor authentication for admin
7. Set up proper logging and monitoring
8. Add data encryption
9. Implement backup systems
10. Add audit trails
