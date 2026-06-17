import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', courseId: '', linkUrl: '', file: null });

  const fetchData = () => {
    Promise.all([
      api.get('/notes'),
      api.get('/courses'),
    ]).then(([n, c]) => {
      setNotes(n.data.data || []);
      setCourses(c.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('courseId', form.courseId);
    if (form.linkUrl) payload.append('linkUrl', form.linkUrl);
    if (form.file) payload.append('file', form.file);
    try {
      await api.post('/notes', payload);
      toast.success('Note created');
      setForm({ title: '', courseId: '', linkUrl: '', file: null });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    toast.success('Deleted');
    fetchData();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Manage Notes</h2>
      <form onSubmit={handleCreate} className="glass-card p-6 mb-8 space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Note</h3>
        <input className="input-field" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className="input-field" required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
          <option value="">Select internship program</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <input className="input-field" placeholder="Resource link (optional)" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
        <input type="file" accept=".pdf,.doc,.docx" className="input-field" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
        <button type="submit" className="btn-primary">Upload Note</button>
      </form>
      <div className="space-y-3">
        {notes.map((n) => (
          <div key={n._id} className="glass-card p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-slate-500">{n.course?.title}</p>
            </div>
            <button onClick={() => handleDelete(n._id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotes;
