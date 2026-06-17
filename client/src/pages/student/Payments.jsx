import { useEffect, useState } from 'react';
import { IndianRupee, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusIcon = { paid: CheckCircle, failed: XCircle, created: Clock };
const statusColor = { paid: 'text-green-600', failed: 'text-red-600', created: 'text-amber-600' };

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my').then(({ data }) => setPayments(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Payment History</h2>
      {payments.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">No payments yet</div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const Icon = statusIcon[p.status] || Clock;
            return (
              <div key={p._id} className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{p.course?.title}</p>
                  <p className="text-sm text-slate-500">Receipt: {p.receipt}</p>
                  <p className="text-sm text-slate-500">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center text-xl font-bold text-brand-700">
                    <IndianRupee className="w-5 h-5" />{p.amount}
                  </p>
                  <p className={`flex items-center gap-1 text-sm capitalize ${statusColor[p.status]}`}>
                    <Icon className="w-4 h-4" /> {p.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Payments;
