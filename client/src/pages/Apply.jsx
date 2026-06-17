import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Apply = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    branch: '',
    year: '',
    internshipFromDate: '',
    internshipToDate: '',
    projectTitle: '',
    certificateDate: '',
    internshipSlug: slug || '',
    duration: '',
    resume: null,
  });

  useEffect(() => {
    api.get('/courses').then(({ data }) => {
      const list = data.data || [];
      setInternships(list);
      if (slug) {
        const selected = list.find((c) => c.slug === slug);
        if (selected) setForm((f) => ({ ...f, duration: selected.duration, internshipSlug: slug }));
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  const selectedInternship = internships.find((c) => c.slug === form.internshipSlug);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.internshipSlug) {
      toast.error('Please select an internship program');
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'resume' && val) payload.append('resume', val);
        else if (key !== 'resume' && val) payload.append(key, val);
      });
      if (selectedInternship) payload.append('courseId', selectedInternship._id);

      const { data } = await api.post('/applications', payload);
      toast.success('Application submitted! Complete payment to proceed.');
      const appId = data.data?.applicationId;
      if (appId) {
        navigate(`/apply/payment/${appId}?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="py-12 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">Apply for Internship</h1>
          <p className="section-subtitle mx-auto mt-4">
            No account required. Submit your details, complete payment, and receive your certificate by email after approval.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 space-y-5"
        >
          {[
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            { name: 'collegeName', label: 'College Name', type: 'text', required: true },
            { name: 'branch', label: 'Branch', type: 'text', required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type={field.type}
                required={field.required}
                className="input-field mt-1"
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Year</label>
            <select
              required
              className="input-field mt-1"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Certificate Date</label>
            <input
              type="date"
              required
              className="input-field mt-1"
              value={form.certificateDate}
              onChange={(e) => setForm({ ...form, certificateDate: e.target.value })}
            />
            <p className="text-xs text-slate-500 mt-1">This date will appear on your internship certificate.</p>
          </div>

          <div>
            <label className="text-sm font-medium">Internship From Date</label>
            <input
              type="date"
              required
              className="input-field mt-1"
              value={form.internshipFromDate}
              onChange={(e) => setForm({ ...form, internshipFromDate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Internship To Date</label>
            <input
              type="date"
              required
              className="input-field mt-1"
              min={form.internshipFromDate || undefined}
              value={form.internshipToDate}
              onChange={(e) => setForm({ ...form, internshipToDate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Project Title (for certificate)</label>
            <input
              type="text"
              className="input-field mt-1"
              placeholder="e.g. FortiGuard: Implementing a Three-Level Password System Using Python"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Internship Selected</label>
            <select
              required
              className="input-field mt-1"
              value={form.internshipSlug}
              onChange={(e) => {
                const selected = internships.find((c) => c.slug === e.target.value);
                setForm({ ...form, internshipSlug: e.target.value, duration: selected?.duration || '' });
              }}
            >
              <option value="">Select internship</option>
              {internships.map((c) => (
                <option key={c._id} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Duration</label>
            <select
              required
              className="input-field mt-1"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            >
              {['4 Weeks', '6 Weeks', '8 Weeks', '10 Weeks', '12 Weeks'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Resume Upload (optional)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="input-field mt-1"
              onChange={(e) => setForm({ ...form, resume: e.target.files[0] })}
            />
          </div>

          {selectedInternship && (
            <p className="text-sm text-slate-500">
              Program fee: <strong>₹{selectedInternship.price?.toLocaleString()}</strong>
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Application</>}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Apply;
