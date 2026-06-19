import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  submitted: 'bg-blue-100 text-blue-700',
  verified: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const AdminPayments = () => {
  const [payments, setPayments] = useState({ data: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const resolveScreenshotUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${base}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const fetchData = () => {
    setLoading(true);
    api.get('/payments/all', { params: { page, limit: 10 } })
      .then(({ data }) => setPayments(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleVerify = async (id) => {
    setActionId(id);
    try {
      await api.post(`/payments/${id}/verify`);
      toast.success('Payment verified and student enrolled');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await api.post(`/payments/${id}/reject`);
      toast.success('Payment rejected');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Payments Management</h2>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 dark:bg-brand-900">
            <tr>
              <th className="text-left p-4">Student / Applicant</th>
              <th className="text-left p-4">Program</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">UTR</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.data?.map((p) => (
              <tr key={p._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4">
                  <p>{p.user?.fullName || p.application?.fullName || '—'}</p>
                  <p className="text-xs text-slate-500">{p.user?.email || p.application?.email}</p>
                </td>
                <td className="p-4">{p.course?.title}</td>
                <td className="p-4 font-semibold">₹{p.amount}</td>
                <td className="p-4">
                  <p className="text-xs">{p.utrNumber || '—'}</p>
                  {p.screenshotUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(resolveScreenshotUrl(p.screenshotUrl))}
                      className="text-brand-600 text-xs flex items-center gap-1 mt-1 hover:underline"
                    >
                      <Eye className="w-3 h-3" /> View Screenshot
                    </button>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColors[p.status] || ''}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4">
                  {p.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(p._id)}
                        disabled={actionId === p._id}
                        className="p-2 rounded-lg bg-green-100 text-green-700"
                        title="Verify"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        disabled={actionId === p._id}
                        className="p-2 rounded-lg bg-red-100 text-red-700"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="bg-white dark:bg-brand-900 rounded-xl p-4 max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Payment screenshot" className="max-w-full rounded-lg" />
            <div className="flex gap-3 mt-4">
              <a href={previewUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                Open in new tab
              </a>
              <button type="button" onClick={() => setPreviewUrl(null)} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
