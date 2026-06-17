import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

import Home from './pages/Home';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import Services from './pages/Services';
import Apply from './pages/Apply';
import ApplyPayment from './pages/ApplyPayment';
import About from './pages/About';
import Contact from './pages/Contact';
import Verify from './pages/Verify';
import Login from './pages/Login';

import StudentDashboard from './pages/student/Dashboard';
import MyInternships from './pages/student/MyInternships';
import ApplyInternship from './pages/student/ApplyInternship';
import Payments from './pages/student/Payments';
import OfferLetter from './pages/student/OfferLetter';
import Certificates from './pages/student/Certificates';
import Notes from './pages/student/Notes';
import Projects from './pages/student/Projects';
import Documents from './pages/student/Documents';
import Settings from './pages/student/Settings';

import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin/Students';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminCourses from './pages/admin/AdminCourses';
import AdminApplications from './pages/admin/AdminApplications';
import PaymentSettings from './pages/admin/PaymentSettings';
import AdminRecommendations from './pages/admin/AdminRecommendations';
import AdminNotes from './pages/admin/AdminNotes';
import AdminProjects from './pages/admin/AdminProjects';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:slug" element={<InternshipDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/apply/payment/:applicationId" element={<ApplyPayment />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/:slug" element={<Apply />} />
        <Route path="/courses" element={<Navigate to="/internships" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:certificateId" element={<Verify />} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/register" element={<Navigate to="/apply" replace />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="internships" element={<MyInternships />} />
        <Route path="apply/:slug" element={<ApplyInternship />} />
        <Route path="notes" element={<Notes />} />
        <Route path="projects" element={<Projects />} />
        <Route path="documents" element={<Documents />} />
        <Route path="payments" element={<Payments />} />
        <Route path="offer-letter" element={<Navigate to="/dashboard/documents" replace />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="complete" element={<Navigate to="/dashboard/certificates" replace />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute adminOnly><DashboardLayout admin /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="settings/payment" element={<PaymentSettings />} />
        <Route path="notes" element={<AdminNotes />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="recommendations" element={<AdminRecommendations />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
