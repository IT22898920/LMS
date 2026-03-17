import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import GuardianDashboard from './pages/Dashboard/GuardianDashboard';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import GuardianLinks from './pages/Guardians/GuardianLinks';
import ReportList from './pages/Reports/ReportList';
import ReportView from './pages/Reports/ReportView';
import ReportForm from './pages/Reports/ReportForm';
import GroupList from './pages/Groups/GroupList';
import GroupDetail from './pages/Groups/GroupDetail';
import ActivityLog from './pages/Activity/ActivityLog';
import MaterialsPage from './pages/Materials/MaterialsPage';
import FeedbackPage from './pages/Feedback/FeedbackPage';
import QuizPage from './pages/Quiz/QuizPage';
import ProgressPage from './pages/Progress/ProgressPage';
import Register from './pages/Register';

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'admin')    return <AdminDashboard />;
  if (user.role === 'teacher')  return <TeacherDashboard />;
  if (user.role === 'student')  return <StudentDashboard />;
  if (user.role === 'guardian') return <GuardianDashboard />;
  return <Navigate to="/" replace />;
};

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const PageLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}
  >
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-white border-l-transparent border-r-transparent border-b-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        </div>
      </div>
      <p className="text-white/80 font-semibold text-base tracking-wide">eduCare LMS</p>
    </div>
  </div>
);

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;

  return (
    <Routes>
      {/* Public routes — each has its own entrance animation */}
      <Route path="/"         element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected dashboard — Layout persists, outlet animates (see Layout.jsx) */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardRouter />} />
        <Route path="users"           element={<ProtectedRoute roles={['admin']}><UserList /></ProtectedRoute>} />
        <Route path="users/new"       element={<ProtectedRoute roles={['admin']}><UserForm /></ProtectedRoute>} />
        <Route path="users/:id/edit"  element={<ProtectedRoute roles={['admin']}><UserForm /></ProtectedRoute>} />
        <Route path="guardians"       element={<ProtectedRoute roles={['admin','teacher']}><GuardianLinks /></ProtectedRoute>} />
        <Route path="reports"         element={<ProtectedRoute><ReportList /></ProtectedRoute>} />
        <Route path="reports/new"     element={<ProtectedRoute roles={['admin','teacher']}><ReportForm /></ProtectedRoute>} />
        <Route path="reports/:id"     element={<ProtectedRoute><ReportView /></ProtectedRoute>} />
        <Route path="groups"          element={<ProtectedRoute><GroupList /></ProtectedRoute>} />
        <Route path="groups/:id"      element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
        <Route path="activity"        element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
        <Route path="materials"       element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
        <Route path="feedback"        element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        <Route path="quiz"            element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="progress"        element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
