import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const OfferLetter = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/internships/my').then(({ data }) => {
      setInternships((data.data || []).filter((i) => i.offerLetterUrl));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Offer Letters</h2>
      {internships.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Complete payment to receive your offer letter automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((int) => (
            <div key={int._id} className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="font-semibold">{int.course?.title}</p>
                <p className="text-sm text-slate-500">{int.internshipId}</p>
              </div>
              <a href={int.offerLetterUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferLetter;
