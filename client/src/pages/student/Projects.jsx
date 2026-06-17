import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FolderKanban, Send } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [forms, setForms] = useState({});

  const fetchData = () => {
    api.get('/projects/my').then(({ data }) => {
      setProjects(data.data || []);
      const initial = {};
      (data.data || []).forEach((p) => {
        initial[p._id] = {
          githubUrl: p.submission?.githubUrl || '',
          liveUrl: p.submission?.liveUrl || '',
          description: p.submission?.description || '',
        };
      });
      setForms(initial);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (projectId) => {
    setSubmitting(projectId);
    try {
      await api.post(`/projects/${projectId}/submit`, forms[projectId]);
      toast.success('Project submitted!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Projects</h2>
      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FolderKanban className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No projects assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project._id} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-sm text-slate-500">{project.course?.title}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-brand-50 text-brand-700">{project.level}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{project.description}</p>
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="text-sm font-medium">Submit your work (optional)</p>
                <input
                  className="input-field"
                  placeholder="GitHub URL"
                  value={forms[project._id]?.githubUrl || ''}
                  onChange={(e) => setForms({ ...forms, [project._id]: { ...forms[project._id], githubUrl: e.target.value } })}
                />
                <input
                  className="input-field"
                  placeholder="Live URL"
                  value={forms[project._id]?.liveUrl || ''}
                  onChange={(e) => setForms({ ...forms, [project._id]: { ...forms[project._id], liveUrl: e.target.value } })}
                />
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Description"
                  value={forms[project._id]?.description || ''}
                  onChange={(e) => setForms({ ...forms, [project._id]: { ...forms[project._id], description: e.target.value } })}
                />
                <button
                  onClick={() => handleSubmit(project._id)}
                  disabled={submitting === project._id}
                  className="btn-primary text-sm"
                >
                  <Send className="w-4 h-4" />
                  {submitting === project._id ? 'Saving...' : project.submission ? 'Update Submission' : 'Submit'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
