import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/internships/my').then(({ data }) => setInternships(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">My Internships</h2>
        <Link to="/internships" className="btn-primary text-sm">Apply for New</Link>
      </div>
      {internships.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-500 mb-4">No active internships yet.</p>
          <Link to="/apply" className="btn-primary">Apply Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((int, i) => (
            <motion.div key={int._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{int.course?.title}</h3>
                  <p className="text-sm text-slate-500">ID: {int.internshipId}</p>
                  <p className="text-sm mt-1">Duration: {int.duration} | {new Date(int.startDate).toLocaleDateString()} - {new Date(int.endDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  int.status === 'active' ? 'bg-green-100 text-green-700' :
                  int.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{int.status.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                {int.offerLetterUrl && (
                  <a href={int.offerLetterUrl} target="_blank" rel="noreferrer" className="btn-outline text-sm py-2">
                    <Download className="w-4 h-4" /> Offer Letter
                  </a>
                )}
                {int.status === 'active' && (
                  <Link to="/dashboard/certificates" className="btn-primary text-sm">Get Certificate</Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInternships;
