import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]), 1);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Monthly Revenue</h3>
          <div className="flex items-end gap-2 h-48">
            {stats.monthlyRevenue?.map((m) => (
              <div key={m._id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-slate-500">{months[m._id - 1]}</span>
              </div>
            )) || <p className="text-slate-500">No revenue data yet</p>}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Internship Status Breakdown</h3>
          <div className="space-y-3">
            {stats.statusBreakdown?.map((s) => (
              <div key={s._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{s._id?.replace('_', ' ')}</span>
                  <span>{s.count}</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${(s.count / (stats.totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
