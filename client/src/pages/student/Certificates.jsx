import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Award, Download } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  const fetchData = () => {
    Promise.all([
      api.get('/certificates/my'),
      api.get('/internships/my'),
    ]).then(([certRes, intRes]) => {
      setCertificates(certRes.data.data || []);
      setInternships(intRes.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const activeWithoutCert = internships.filter((i) => i.status === 'active' && !i.certificate);

  const handleGenerate = async (internshipId) => {
    setGenerating(internshipId);
    try {
      await api.post('/certificates/generate', { internshipId });
      toast.success('Certificate generated!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">My Certificates</h2>

      {activeWithoutCert.length > 0 && (
        <div className="glass-card p-6 mb-6 border-l-4 border-brand-500">
          <h3 className="font-semibold mb-3">Get Your Certificate</h3>
          {activeWithoutCert.map((int) => (
            <div key={int._id} className="flex flex-wrap items-center justify-between gap-3 py-2">
              <span>{int.course?.title}</span>
              <button
                onClick={() => handleGenerate(int._id)}
                disabled={generating === int._id}
                className="btn-primary text-sm"
              >
                <Award className="w-4 h-4" />
                {generating === int._id ? 'Generating...' : 'Get Certificate'}
              </button>
            </div>
          ))}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No certificates yet. Click Get Certificate when your internship is active.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert._id} className="glass-card p-6 border-l-4 border-gold-500">
              <Award className="w-10 h-10 text-gold-500 mb-3" />
              <h3 className="font-semibold">{cert.courseName}</h3>
              <p className="text-sm text-slate-500 mt-1">ID: {cert.certificateId}</p>
              <p className="text-sm text-slate-500">Issued: {new Date(cert.completionDate).toLocaleDateString()}</p>
              <div className="flex gap-2 mt-4">
                {cert.certificateUrl && (
                  <a href={cert.certificateUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2">
                    <Download className="w-4 h-4" /> Download
                  </a>
                )}
                <a href={`/verify/${cert.certificateId}`} className="btn-outline text-sm py-2">Verify</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
