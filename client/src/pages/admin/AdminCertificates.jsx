import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCertificates = () => {
  const [certs, setCerts] = useState({ data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/all', { params: { limit: 20 } })
      .then(({ data }) => setCerts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Certificates Management</h2>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 dark:bg-brand-900">
            <tr>
              <th className="text-left p-4">Certificate ID</th>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4 hidden sm:table-cell">Course</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.data?.map((c) => (
              <tr key={c._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 font-mono text-xs">{c.certificateId}</td>
                <td className="p-4">{c.studentName || c.user?.fullName}</td>
                <td className="p-4 hidden sm:table-cell">{c.courseName}</td>
                <td className="p-4">
                  <Link to={`/verify/${c.certificateId}`} className="text-brand-600 flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" /> Verify
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCertificates;
