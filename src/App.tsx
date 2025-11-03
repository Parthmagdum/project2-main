import { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { FeedbackView } from './views/FeedbackView';
import { AlertsView } from './views/AlertsView';
import { InsightsView } from './views/InsightsView';
import { RoleSelection } from './components/Auth/RoleSelection';
import { AdminLogin } from './components/Auth/AdminLogin';
import { StudentLogin } from './components/Auth/StudentLogin';
import { FeedbackForm } from './components/Student/FeedbackForm';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { feedbackStorage } from './utils/feedbackStorage';
import { 
  mockUser, 
  mockAlerts, 
  mockRecommendations, 
  mockAnalytics 
} from './data/mockData';
import { Alert, FeedbackItem } from './types';

type AuthState = 'role-selection' | 'admin-login' | 'student-login' | 'admin-dashboard' | 'student-feedback' | 'student-dashboard';

function App() {
  const [authState, setAuthState] = useState<AuthState>('role-selection');
  const [studentId, setStudentId] = useState<string>('');
  const [activeView, setActiveView] = useState('dashboard');
  const [alerts, setAlerts] = useState(mockAlerts);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [dashboardKey, setDashboardKey] = useState(0); // Key to force remount

  // Load feedback from Supabase on mount and when returning to admin dashboard
  useEffect(() => {
    const loadFeedback = async () => {
      if (authState === 'admin-dashboard') {
        const storedFeedback = await feedbackStorage.getAllFeedback();
        setFeedback(storedFeedback);
      }
    };
    loadFeedback();
  }, [authState, activeView]); // Re-load when view changes

  const reloadFeedback = async () => {
    const storedFeedback = await feedbackStorage.getAllFeedback();
    setFeedback(storedFeedback);
  };

  const handleUpdateAlert = (alertId: string, newStatus: Alert['status']) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    );
  };

  const handleRoleSelect = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setAuthState('student-login');
    } else {
      setAuthState('admin-login');
    }
  };

  const handleAdminLogin = (email: string, password: string) => {
    // Simple demo authentication
    if (email === 'admin@university.edu' && password === 'admin123') {
      setAuthState('admin-dashboard');
    } else {
      alert('Invalid credentials. Use demo account:\nEmail: admin@university.edu\nPassword: admin123');
    }
  };

  const handleStudentLogin = (id: string) => {
    setStudentId(id);
    setAuthState('student-dashboard');
  };

  const handleLogout = () => {
    setAuthState('role-selection');
    setStudentId('');
    setActiveView('dashboard');
  };

  const handleSubmitNewFeedback = () => {
    setAuthState('student-feedback');
  };

  const handleBackToStudentDashboard = () => {
    setAuthState('student-dashboard');
    setDashboardKey(prev => prev + 1); // Increment key to force remount and reload data
  };

  const renderView = () => {
    // Calculate analytics from actual feedback
    const analytics = feedbackStorage.calculateAnalytics(feedback);
    
    switch (activeView) {
      case 'dashboard':
        return <DashboardView analytics={analytics} alerts={alerts} />;
      case 'feedback':
        return <FeedbackView feedback={feedback} onFeedbackUpdated={reloadFeedback} />;
      case 'alerts':
        return <AlertsView alerts={alerts} onUpdateAlert={handleUpdateAlert} />;
      case 'insights':
        return <InsightsView recommendations={mockRecommendations} />;
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Advanced analytics dashboard coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                This section will include detailed statistical analysis, predictive modeling, and comparative reports.
              </p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Exports</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Report generation dashboard coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                Generate custom reports, schedule automated exports, and access historical data.
              </p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">User management interface coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                Manage user roles, permissions, and access controls for FERPA compliance.
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">System configuration panel coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                Configure NLP models, alert thresholds, and integration settings.
              </p>
            </div>
          </div>
        );
      default:
        return <DashboardView analytics={mockAnalytics} alerts={alerts} />;
    }
  };

  // Render authentication screens
  if (authState === 'role-selection') {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  if (authState === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => setAuthState('role-selection')} />;
  }

  if (authState === 'student-login') {
    return <StudentLogin onLogin={handleStudentLogin} onBack={() => setAuthState('role-selection')} />;
  }

  if (authState === 'student-dashboard') {
    return <StudentDashboard key={dashboardKey} studentId={studentId} onLogout={handleLogout} onSubmitNew={handleSubmitNewFeedback} />;
  }

  if (authState === 'student-feedback') {
    return <FeedbackForm studentId={studentId} onLogout={handleLogout} onBack={handleBackToStudentDashboard} />;
  }

  // Render admin dashboard
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1">
        <Header 
          user={mockUser} 
          onLogout={handleLogout} 
        />
        <main className="flex-1">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;