import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, GraduationCap, Briefcase } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const emptyFypForm = { title: '', description: '', about: '', isActive: true };

const AdminProjects = () => {
  const [tab, setTab] = useState('internship');
  const [projects, setProjects] = useState([]);
  const [finalYearProjects, setFinalYearProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internshipForm, setInternshipForm] = useState({ title: '', description: '', level: 'Beginner', courseId: '' });
  const [fypForm, setFypForm] = useState(emptyFypForm);

  const fetchData = () => {
    Promise.all([
      api.get('/projects'),
      api.get('/final-year-projects'),
      api.get('/courses'),
    ]).then(([p, fyp, c]) => {
      setProjects(p.data.data || []);
      setFinalYearProjects(fyp.data.data || []);
      setCourses(c.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', internshipForm);
      toast.success('Internship project created');
      setInternshipForm({ title: '', description: '', level: 'Beginner', courseId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleCreateFyp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/final-year-projects', fypForm);
      toast.success('Final year project created');
      setFypForm(emptyFypForm);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteInternship = async (id) => {
    await api.delete(`/projects/${id}`);
    toast.success('Deleted');
    fetchData();
  };

  const handleDeleteFyp = async (id) => {
    await api.delete(`/final-year-projects/${id}`);
    toast.success('Deleted');
    fetchData();
  };

  const toggleFypActive = async (project) => {
    try {
      await api.put(`/final-year-projects/${project._id}`, { isActive: !project.isActive });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Manage Projects</h2>

      <div className="flex gap-2 mb-8">
        <button
          type="button"
          onClick={() => setTab('internship')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'internship'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 dark:bg-brand-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Internship Projects
        </button>
        <button
          type="button"
          onClick={() => setTab('final-year')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'final-year'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 dark:bg-brand-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Final Year Projects
        </button>
      </div>

      {tab === 'internship' ? (
        <>
          <form onSubmit={handleCreateInternship} className="glass-card p-6 mb-8 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Internship Project</h3>
            <input className="input-field" placeholder="Title" required value={internshipForm.title} onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })} />
            <textarea className="input-field" rows={3} placeholder="Description" required value={internshipForm.description} onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })} />
            <select className="input-field" value={internshipForm.level} onChange={(e) => setInternshipForm({ ...internshipForm, level: e.target.value })}>
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
            </select>
            <select className="input-field" required value={internshipForm.courseId} onChange={(e) => setInternshipForm({ ...internshipForm, courseId: e.target.value })}>
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
                <button onClick={() => handleDeleteInternship(p._id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleCreateFyp} className="glass-card p-6 mb-8 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Final Year Project</h3>
            <input
              className="input-field"
              placeholder="Project Title"
              required
              value={fypForm.title}
              onChange={(e) => setFypForm({ ...fypForm, title: e.target.value })}
            />
            <textarea
              className="input-field"
              rows={2}
              placeholder="Short Description (shown on project card)"
              required
              value={fypForm.description}
              onChange={(e) => setFypForm({ ...fypForm, description: e.target.value })}
            />
            <textarea
              className="input-field"
              rows={5}
              placeholder="About the Project (detailed overview)"
              required
              value={fypForm.about}
              onChange={(e) => setFypForm({ ...fypForm, about: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={fypForm.isActive}
                onChange={(e) => setFypForm({ ...fypForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Show on public Final Year Projects page
            </label>
            <button type="submit" className="btn-primary">Create Project</button>
          </form>
          <div className="space-y-3">
            {finalYearProjects.length === 0 && (
              <p className="text-slate-500 text-sm">No final year projects yet. Add one above to display on the public page.</p>
            )}
            {finalYearProjects.map((p) => (
              <div key={p._id} className="glass-card p-4 flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{p.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-brand-800 dark:text-slate-400'}`}>
                      {p.isActive ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{p.description}</p>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.about}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleFypActive(p)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-brand-800 hover:bg-slate-200 dark:hover:bg-brand-700"
                  >
                    {p.isActive ? 'Hide' : 'Publish'}
                  </button>
                  <button onClick={() => handleDeleteFyp(p._id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProjects;
