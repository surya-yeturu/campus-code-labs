import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Search, RefreshCw, Download, X, Phone, Mail, Copy, Trash2,
  MessageCircle, GraduationCap, Ban, UserCheck, UserX,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Interested: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Enrolled: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'Not Interested': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const STAT_CARDS = [
  { key: 'total', label: 'Total Leads', color: 'text-brand-600' },
  { key: 'newLeads', label: 'New Leads', color: 'text-blue-600' },
  { key: 'contacted', label: 'Contacted', color: 'text-amber-600' },
  { key: 'interested', label: 'Interested', color: 'text-purple-600' },
  { key: 'enrolled', label: 'Enrolled', color: 'text-green-600' },
  { key: 'conversionRate', label: 'Conversion Rate', color: 'text-brand-700', suffix: '%' },
];

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => toast.success('Copied!'));
};

const exportData = (candidates, format) => {
  if (!candidates.length) {
    toast.error('No data to export');
    return;
  }
  const headers = ['Name', 'Phone', 'Email', 'College', 'Branch', 'Passing Year', 'Location', 'Status', 'Experience', 'Role', 'Batch', 'Created'];
  const rows = candidates.map((c) => [
    c.fullName, c.phone, c.email, c.college, c.branch, c.passingYear,
    c.location, c.status, c.experience, c.interestedRole, c.preferredBatch,
    new Date(c.createdAt).toLocaleDateString(),
  ]);
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], {
    type: format === 'excel'
      ? 'application/vnd.ms-excel'
      : 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `salesforce-candidates.${format === 'excel' ? 'xls' : 'csv'}`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported as ${format === 'excel' ? 'Excel' : 'CSV'}`);
};

const CandidateDrawer = ({ candidate, onClose, onUpdate, onDelete, actionId }) => {
  if (!candidate) return null;

  const updateStatus = (status) => onUpdate(candidate._id, { status });

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-brand-900 border-l border-slate-200 dark:border-slate-800 z-50 overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-brand-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Candidate Details</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Full Name</p>
            <p className="font-semibold text-lg">{candidate.fullName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-medium">{candidate.phone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-sm break-all">{candidate.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">College</p>
              <p className="font-medium">{candidate.college}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Branch</p>
              <p className="font-medium">{candidate.branch}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Passing Year</p>
              <p className="font-medium">{candidate.passingYear}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="font-medium">{candidate.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Current Status</p>
              <p className="font-medium">{candidate.currentStatus}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Experience</p>
              <p className="font-medium">{candidate.experience}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Interested Role</p>
              <p className="font-medium">{candidate.interestedRole}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Preferred Batch</p>
              <p className="font-medium">{candidate.preferredBatch}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500">Status</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status] || ''}`}>
              {candidate.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500">Why Salesforce</p>
            <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{candidate.reason}</p>
          </div>

          {candidate.resume && (
            <div>
              <p className="text-xs text-slate-500">Resume</p>
              <a href={candidate.resume} target="_blank" rel="noreferrer" className="text-brand-600 text-sm hover:underline">
                View Resume
              </a>
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500">Created Date</p>
            <p className="font-medium">{new Date(candidate.createdAt).toLocaleString()}</p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <p className="text-sm font-semibold">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${candidate.phone}`} className="btn-outline text-xs py-2 px-3">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <button onClick={() => copyToClipboard(candidate.phone)} className="btn-outline text-xs py-2 px-3">
                <Copy className="w-3.5 h-3.5" /> Copy Phone
              </button>
              <button onClick={() => copyToClipboard(candidate.email)} className="btn-outline text-xs py-2 px-3">
                <Mail className="w-3.5 h-3.5" /> Copy Email
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                disabled={actionId === candidate._id}
                onClick={() => updateStatus('Contacted')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Mark Contacted
              </button>
              <button
                disabled={actionId === candidate._id}
                onClick={() => updateStatus('Enrolled')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
              >
                <GraduationCap className="w-3.5 h-3.5" /> Mark Enrolled
              </button>
              <button
                disabled={actionId === candidate._id}
                onClick={() => updateStatus('Interested')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                <UserCheck className="w-3.5 h-3.5" /> Mark Interested
              </button>
              <button
                disabled={actionId === candidate._id}
                onClick={() => updateStatus('Not Interested')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
              >
                <UserX className="w-3.5 h-3.5" /> Not Interested
              </button>
              <button
                disabled={actionId === candidate._id}
                onClick={() => updateStatus('Closed')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <Ban className="w-3.5 h-3.5" /> Mark Closed
              </button>
              <button
                disabled={actionId === candidate._id}
                onClick={() => onDelete(candidate._id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AdminSalesforceCandidates = () => {
  const [result, setResult] = useState({ data: [], pagination: {}, stats: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '', passingYear: '', branch: '', preferredBatch: '', experience: '',
  });
  const [selected, setSelected] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback((p = page) => {
    setLoading(true);
    api.get('/admin/salesforce', {
      params: {
        page: p,
        limit: 10,
        search: search || undefined,
        status: filters.status || undefined,
        passingYear: filters.passingYear || undefined,
        branch: filters.branch || undefined,
        preferredBatch: filters.preferredBatch || undefined,
        experience: filters.experience || undefined,
      },
    })
      .then(({ data }) => setResult(data))
      .catch(() => toast.error('Failed to load candidates'))
      .finally(() => setLoading(false));
  }, [page, search, filters]);

  useEffect(() => { fetchData(page); }, [page, filters.status, filters.passingYear, filters.preferredBatch, filters.experience]);

  const handleUpdate = async (id, payload) => {
    setActionId(id);
    try {
      const { data } = await api.patch(`/admin/salesforce/${id}`, payload);
      toast.success('Candidate updated');
      setSelected(data.data);
      fetchData(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate permanently?')) return;
    setActionId(id);
    try {
      await api.delete(`/admin/salesforce/${id}`);
      toast.success('Candidate deleted');
      setSelected(null);
      fetchData(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const handleExportAll = async (format) => {
    try {
      const { data } = await api.get('/admin/salesforce', { params: { limit: 10000 } });
      exportData(data.data || [], format);
    } catch {
      toast.error('Export failed');
    }
  };

  const { stats = {}, pagination = {} } = result;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Salesforce Candidates</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="glass-card p-4 text-center">
            <p className={`text-2xl font-display font-bold ${card.color}`}>
              {stats[card.key] ?? 0}{card.suffix || ''}
            </p>
            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="input-field max-w-xs"
          placeholder="Search name, phone, email, college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (setPage(1), fetchData(1))}
        />
        <select className="input-field max-w-[140px]" value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}>
          <option value="">All Status</option>
          {Object.keys(statusColors).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          className="input-field max-w-[120px]"
          placeholder="Passing Year"
          value={filters.passingYear}
          onChange={(e) => { setFilters({ ...filters, passingYear: e.target.value }); setPage(1); }}
        />
        <input
          className="input-field max-w-[120px]"
          placeholder="Branch"
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && (setPage(1), fetchData(1))}
        />
        <select className="input-field max-w-[140px]" value={filters.preferredBatch} onChange={(e) => { setFilters({ ...filters, preferredBatch: e.target.value }); setPage(1); }}>
          <option value="">All Batches</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Weekend">Weekend</option>
        </select>
        <select className="input-field max-w-[140px]" value={filters.experience} onChange={(e) => { setFilters({ ...filters, experience: e.target.value }); setPage(1); }}>
          <option value="">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0-1 Years">0-1 Years</option>
          <option value="1-2 Years">1-2 Years</option>
          <option value="2+ Years">2+ Years</option>
        </select>
        <button onClick={() => { setPage(1); fetchData(1); }} className="btn-outline">
          <Search className="w-4 h-4" /> Search
        </button>
        <button onClick={() => fetchData(page)} className="btn-outline">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
        <button onClick={() => handleExportAll('csv')} className="btn-outline">
          <Download className="w-4 h-4" /> CSV
        </button>
        <button onClick={() => handleExportAll('excel')} className="btn-outline">
          <Download className="w-4 h-4" /> Excel
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 dark:bg-brand-900">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4 hidden sm:table-cell">Phone</th>
                <th className="text-left p-4 hidden md:table-cell">Email</th>
                <th className="text-left p-4 hidden lg:table-cell">College</th>
                <th className="text-left p-4 hidden lg:table-cell">Branch</th>
                <th className="text-left p-4 hidden md:table-cell">Passing Year</th>
                <th className="text-left p-4">Batch</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {result.data?.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className="border-t border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-brand-50/50 dark:hover:bg-brand-800/30 transition-colors"
                >
                  <td className="p-4 font-medium">{c.fullName}</td>
                  <td className="p-4 hidden sm:table-cell">{c.phone}</td>
                  <td className="p-4 hidden md:table-cell text-xs">{c.email}</td>
                  <td className="p-4 hidden lg:table-cell">{c.college}</td>
                  <td className="p-4 hidden lg:table-cell">{c.branch}</td>
                  <td className="p-4 hidden md:table-cell">{c.passingYear}</td>
                  <td className="p-4">{c.preferredBatch}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[c.status] || ''}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.data?.length === 0 && (
            <p className="text-center text-slate-500 py-12">No candidates found.</p>
          )}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-lg text-sm ${p === page ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-brand-800'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <CandidateDrawer
        candidate={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        actionId={actionId}
      />
    </div>
  );
};

export default AdminSalesforceCandidates;
