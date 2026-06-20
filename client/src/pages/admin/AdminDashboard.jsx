import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, IndianRupee, Award, Briefcase } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  const cards = [
    { label: 'Total Applicants', value: stats.totalApplicants || 0, icon: Users, color: 'from-blue-500 to-blue-700' },
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue?.toLocaleString() || 0}`, icon: IndianRupee, color: 'from-green-500 to-green-700' },
    { label: 'Certificates Issued', value: stats.totalCertificates, icon: Award, color: 'from-purple-500 to-purple-700' },
    { label: 'Pending Approvals', value: stats.pendingApprovals || 0, icon: Briefcase, color: 'from-amber-500 to-amber-700' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Admin Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Recent Payments</h3>
        {stats.recentPayments?.length === 0 ? (
          <p className="text-slate-500">No payments yet</p>
        ) : (
          <div className="space-y-3">
            {stats.recentPayments?.map((p) => (
              <div key={p._id} className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-brand-900/50">
                <span>{p.user?.fullName || p.application?.fullName} - {p.course?.title}</span>
                <span className="font-semibold text-green-600">Rs. {p.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
