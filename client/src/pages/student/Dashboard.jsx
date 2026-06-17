import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, CreditCard, Award, FileText, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
  const [internships, setInternships] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/internships/my'),
      api.get('/payments/my'),
      api.get('/certificates/my'),
    ]).then(([intRes, payRes, certRes]) => {
      setInternships(intRes.data.data || []);
      setPayments(payRes.data.data || []);
      setCertificates(certRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const active = internships.filter((i) => i.status === 'active').length;
  const pending = internships.filter((i) => i.status === 'pending_payment').length;
  const completed = internships.filter((i) => i.status === 'completed').length;

  const stats = [
    { label: 'Active Internships', value: active, icon: Briefcase, color: 'from-blue-500 to-blue-700', link: '/dashboard/internships' },
    { label: 'Pending Payment', value: pending, icon: CreditCard, color: 'from-amber-500 to-amber-700', link: '/dashboard/internships' },
    { label: 'Completed', value: completed, icon: Award, color: 'from-green-500 to-green-700', link: '/dashboard/certificates' },
    { label: 'Certificates', value: certificates.length, icon: FileText, color: 'from-purple-500 to-purple-700', link: '/dashboard/certificates' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={s.link} className="block glass-card p-6 hover:shadow-premium transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-brand-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Internships</h3>
        {internships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No internships yet. Enroll in a course to get started!</p>
            <Link to="/internships" className="btn-primary">Browse Internships <ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {internships.slice(0, 5).map((int) => (
              <div key={int._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-brand-900/50">
                <div>
                  <p className="font-medium">{int.course?.title}</p>
                  <p className="text-sm text-slate-500">{int.internshipId}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(int.startDate).toLocaleDateString()} — {new Date(int.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  int.status === 'active' ? 'bg-green-100 text-green-700' :
                  int.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  int.status === 'pending_payment' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {int.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
