import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, CreditCard, FileText, Award, ClipboardCheck,
  Settings, Menu, LogOut, Sun, Moon, ClipboardList, BookOpen, FolderKanban, Files, Cloud,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoMark from '../components/LogoMark';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/internships', icon: Briefcase, label: 'My Internships' },
  { to: '/dashboard/notes', icon: BookOpen, label: 'Notes' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/documents', icon: Files, label: 'Documents' },
  { to: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
  { to: '/dashboard/certificates', icon: Award, label: 'Certificates' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/applications', icon: ClipboardList, label: 'Applications' },
  { to: '/admin/salesforce', icon: Cloud, label: 'Salesforce Candidates' },
  { to: '/admin/students', icon: Briefcase, label: 'Students' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/notes', icon: BookOpen, label: 'Notes' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/recommendations', icon: FileText, label: 'Recommendations' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
  { to: '/admin/courses', icon: ClipboardCheck, label: 'Internships' },
  { to: '/admin/settings/payment', icon: Settings, label: 'Payment Settings' },
  { to: '/admin/analytics', icon: Files, label: 'Analytics' },
];

const DashboardLayout = ({ admin = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const links = admin ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-950 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-brand-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark size={36} />
            <span className="font-display font-bold text-brand-900 dark:text-white">CampusCode Labs</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={logout} className="sidebar-link w-full text-red-600">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-brand-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <h1 className="font-display font-semibold text-lg text-brand-900 dark:text-white">
            {admin ? 'Admin Dashboard' : 'Student Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-800">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-brand-900 dark:text-white">{user?.fullName}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
