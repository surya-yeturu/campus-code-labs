import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const CompletionForm = () => {
  const [internships, setInternships] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ projectDetails: '', experience: '', feedback: '', rating: 5 });

  useEffect(() => {
    api.get('/internships/my').then(({ data }) => {
      const eligible = (data.data || []).filter(
        (i) => i.status === 'active' && !i.certificate
      );
      setInternships(eligible);
      if (eligible.length) setSelected(eligible[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error('No eligible internship');
    setSubmitting(true);
    try {
      await api.post('/certificates/complete', { internshipId: selected, ...form });
      toast.success('Completion submitted! Certificate generated and emailed.');
      setInternships([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (internships.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <h2 className="font-display text-xl font-bold mb-2">No Eligible Internships</h2>
        <p className="text-slate-500">Complete your internship duration to submit the completion form.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-bold mb-6">Internship Completion Form</h2>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Select Internship</label>
          <select className="input-field" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {internships.map((i) => (
              <option key={i._id} value={i._id}>{i.course?.title} — {i.internshipId}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Project Details</label>
          <textarea className="input-field min-h-[100px]" required placeholder="Describe your project..." value={form.projectDetails} onChange={(e) => setForm({ ...form, projectDetails: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Internship Experience</label>
          <textarea className="input-field min-h-[100px]" required value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Feedback / Review</label>
          <textarea className="input-field min-h-[80px]" required value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Rating (1-5)</label>
          <input type="number" min="1" max="5" className="input-field" required value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Generating Certificate...' : 'Submit & Get Certificate'}
        </button>
      </form>
    </div>
  );
};

export default CompletionForm;
