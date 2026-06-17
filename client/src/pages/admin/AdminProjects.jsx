import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', level: 'Beginner', courseId: '' });

  const fetchData = () => {
    Promise.all([api.get('/projects'), api.get('/courses')]).then(([p, c]) => {
      setProjects(p.data.data || []);
      setCourses(c.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      toast.success('Project created');
      setForm({ title: '', description: '', level: 'Beginner', courseId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/projects/${id}`);
    toast.success('Deleted');
    fetchData();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Manage Projects</h2>
      <form onSubmit={handleCreate} className="glass-card p-6 mb-8 space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</h3>
        <input className="input-field" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input-field" rows={3} placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="input-field" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
          {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
        </select>
        <select className="input-field" required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
          <option value="">Select internship program</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <button type="submit" className="btn-primary">Create Project</button>
      </form>
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p._id} className="glass-card p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{p.title} <span className="text-xs text-brand-600">({p.level})</span></p>
              <p className="text-sm text-slate-500">{p.course?.title}</p>
            </div>
            <button onClick={() => handleDelete(p._id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
