import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ApplyInternship = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    duration: '',
    startDate: '',
    endDate: '',
    profilePhoto: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    api.get(`/courses/${slug}`).then(({ data }) => {
      setCourse(data.data);
      setForm((f) => ({ ...f, duration: data.data.duration }));
    }).catch(() => toast.error('Course not found')).finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/internships', {
        courseId: course._id,
        duration: form.duration,
        startDate: form.startDate,
        endDate: form.endDate,
        profilePhoto: form.profilePhoto,
        applicationDetails: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          linkedin: form.linkedin,
          github: form.github,
        },
      });
      toast.success('Application submitted! Proceed to payment.');
      navigate('/dashboard/internships');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-bold mb-2">Apply for Internship</h2>
      <p className="text-slate-600 mb-6">{course.title} — ₹{course.price}</p>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Duration</label>
          <select className="input-field" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
            <option value={course.duration}>{course.duration}</option>
            <option value="4 Weeks">4 Weeks</option>
            <option value="6 Weeks">6 Weeks</option>
            <option value="8 Weeks">8 Weeks</option>
            <option value="10 Weeks">10 Weeks</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input type="date" className="input-field" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <input type="date" className="input-field" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
        <input className="input-field" placeholder="Profile Photo URL (optional)" value={form.profilePhoto} onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })} />
        <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="input-field" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="input-field" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </div>
        <input className="input-field" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        <input className="input-field" placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        <input className="input-field" placeholder="GitHub URL" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyInternship;
