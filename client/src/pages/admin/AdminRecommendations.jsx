import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminRecommendations = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get('/recommendations').then(({ data }) => setLetters(data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/recommendations/${id}/approve`);
      toast.success('Recommendation letter generated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleReject = async (id) => {
    await api.post(`/recommendations/${id}/reject`);
    toast.success('Rejected');
    fetchData();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Recommendation Letters</h2>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 dark:bg-brand-900">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Program</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {letters.map((l) => (
              <tr key={l._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4">{l.user?.fullName}<br /><span className="text-xs text-slate-500">{l.user?.email}</span></td>
                <td className="p-4">{l.course?.title}</td>
                <td className="p-4 capitalize">{l.status}</td>
                <td className="p-4">
                  {l.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(l._id)} className="p-2 bg-green-100 text-green-700 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => handleReject(l._id)} className="p-2 bg-red-100 text-red-700 rounded-lg"><XCircle className="w-4 h-4" /></button>
                    </div>
                  )}
                  {l.fileUrl && l.status === 'approved' && (
                    <a href={l.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 text-xs">Download</a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {letters.length === 0 && <p className="text-center text-slate-500 py-12">No recommendation requests yet.</p>}
      </div>
    </div>
  );
};

export default AdminRecommendations;
