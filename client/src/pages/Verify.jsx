import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, ShieldX, Award, Calendar, BookOpen, Mail, GraduationCap } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Verify = () => {
  const { certificateId: paramId } = useParams();
  const [searchType, setSearchType] = useState('certificate');
  const [searchId, setSearchId] = useState(paramId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const verify = async (id = searchId) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const endpoint = searchType === 'internship'
        ? `/certificates/verify-by-internship/${id.trim()}`
        : `/certificates/verify/${id.trim()}`;
      const { data } = await api.get(endpoint);
      setResult(data);
    } catch {
      setResult({ success: false, verified: false, message: 'Record not found' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) verify(paramId);
  }, [paramId]);

  return (
    <div className="py-12 min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Award className="w-16 h-16 text-brand-600 mx-auto mb-4" />
          <h1 className="section-title">Verify Certificate</h1>
          <p className="section-subtitle mx-auto mt-4">Search by Certificate ID or Internship ID</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-6">
          {[
            { key: 'certificate', label: 'Certificate ID' },
            { key: 'internship', label: 'Internship ID' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setSearchType(tab.key); setResult(null); setSearched(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-brand-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder={searchType === 'certificate' ? 'e.g. CERT-2026-ABC123' : 'e.g. LV-ABC123-XYZ'}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
            />
            <button onClick={() => verify()} className="btn-primary px-6">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {searched && !loading && result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            {result.verified ? (
              <>
                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-green-600 mb-2">Certificate Verified</h2>
                <p className="text-slate-600 mb-6">This is an authentic Campus Code Labs certificate</p>
                <div className="text-left space-y-3 bg-brand-50 dark:bg-brand-900/50 rounded-xl p-6">
                  <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-600" /> <strong>Student:</strong> {result.data.studentName}</p>
                  {result.data.certificateNo && <p><strong>Certificate No:</strong> {result.data.certificateNo}</p>}
                  {result.data.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-600" /> <strong>Email:</strong> {result.data.email}</p>}
                  {result.data.collegeName && <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-brand-600" /> <strong>College:</strong> {result.data.collegeName}</p>}
                  {result.data.branch && <p><strong>Branch:</strong> {result.data.branch}</p>}
                  {result.data.year && <p><strong>Year:</strong> {result.data.year}</p>}
                  <p className="flex items-center gap-2"><Award className="w-4 h-4 text-brand-600" /> <strong>Internship:</strong> {result.data.courseName}</p>
                  {(result.data.internshipFromDate && result.data.internshipToDate) && (
                    <p><strong>Period:</strong> {new Date(result.data.internshipFromDate).toLocaleDateString()} to {new Date(result.data.internshipToDate).toLocaleDateString()}</p>
                  )}
                  {result.data.projectTitle && <p><strong>Project:</strong> {result.data.projectTitle}</p>}
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-600" /> <strong>Certificate Date:</strong> {new Date(result.data.completionDate).toLocaleDateString()}</p>
                  <p><strong>Certificate ID:</strong> {result.data.certificateId}</p>
                  {result.data.internshipId && <p><strong>Internship ID:</strong> {result.data.internshipId}</p>}
                  <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{result.data.status}</span></p>
                </div>
                {result.data.certificateUrl && (
                  <a href={result.data.certificateUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-flex">
                    View Certificate
                  </a>
                )}
              </>
            ) : (
              <>
                <ShieldX className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-red-600">Verification Failed</h2>
                <p className="text-slate-600 mt-2">{result.message || 'Record not found in our database'}</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Verify;
