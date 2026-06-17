import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  payment_submitted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const AdminApplications = () => {
  const [applications, setApplications] = useState({ data: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchData = (page = 1) => {
    setLoading(true);
    api.get('/applications', { params: { page, limit: 10, search, status: statusFilter || undefined } })
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [statusFilter]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.post(`/applications/${id}/approve`);
      toast.success('Application approved — certificate and offer letter emailed');
      fetchData(applications.pagination?.page || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await api.post(`/applications/${id}/reject`);
      toast.success('Application rejected');
      fetchData(applications.pagination?.page || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Applications</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="input-field max-w-xs"
          placeholder="Search name, email, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchData()}
        />
        <select className="input-field max-w-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="payment_submitted">Payment Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={() => fetchData()} className="btn-outline">Search</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 dark:bg-brand-900">
              <tr>
                <th className="text-left p-4">Applicant</th>
                <th className="text-left p-4">Program</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Payment</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.data?.map((app) => (
                <tr key={app._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-4">
                    <p className="font-medium">{app.fullName}</p>
                    <p className="text-xs text-slate-500">{app.email}</p>
                    <p className="text-xs text-slate-500">{app.collegeName} · {app.year}</p>
                    {app.certificateDate && (
                      <p className="text-xs text-slate-400">Cert date: {new Date(app.certificateDate).toLocaleDateString()}</p>
                    )}
                  </td>
                  <td className="p-4">{app.course?.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColors[app.status] || ''}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {app.payment ? (
                      <div>
                        <p className="text-xs">UTR: {app.payment.utrNumber || '—'}</p>
                        {app.payment.screenshotUrl && (
                          <a href={app.payment.screenshotUrl} target="_blank" rel="noreferrer" className="text-brand-600 text-xs flex items-center gap-1 mt-1">
                            <Eye className="w-3 h-3" /> View Screenshot
                          </a>
                        )}
                      </div>
                    ) : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {app.status === 'payment_submitted' && (
                        <button
                          onClick={() => handleApprove(app._id)}
                          disabled={actionId === app._id}
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {['pending', 'payment_submitted'].includes(app.status) && (
                        <button
                          onClick={() => handleReject(app._id)}
                          disabled={actionId === app._id}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.data?.length === 0 && (
            <p className="text-center text-slate-500 py-12">No applications found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
