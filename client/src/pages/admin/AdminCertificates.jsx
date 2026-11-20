import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ExternalLink, FileText, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { resolveFileUrl } from '../../utils/fileUrl';

const AdminCertificates = () => {
  const [certs, setCerts] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [form, setForm] = useState({
    certificateId: '', certificateNo: '', studentName: '', email: '', collegeName: '',
    branch: '', year: '', internshipId: '', internshipFromDate: '', internshipToDate: '',
    projectTitle: '', courseName: '', duration: '', completionDate: '',
  });

  const fetchCertificates = () => api.get('/certificates/all', { params: { limit: 20 } })
    .then(({ data }) => setCerts(data))
    .finally(() => setLoading(false));

  useEffect(() => { fetchCertificates(); }, []);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const importCertificate = async (event) => {
    event.preventDefault();
    if (!pdf) return toast.error('Choose a certificate PDF first');
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append('certificate', pdf);
      await api.post('/certificates/import', payload);
      toast.success('Certificate imported and ready to verify');
      setPdf(null);
      setForm({ certificateId: '', certificateNo: '', studentName: '', email: '', collegeName: '', branch: '', year: '', internshipId: '', internshipFromDate: '', internshipToDate: '', projectTitle: '', courseName: '', duration: '', completionDate: '' });
      event.target.reset();
      await fetchCertificates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Certificate import failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Certificates Management</h2>
      <form onSubmit={importCertificate} className="glass-card p-6 mb-8 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Add an existing certificate</h3>
          <p className="text-sm text-slate-500">Enter the details printed on the PDF so its QR code can verify against MongoDB.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ['certificateId', 'Certificate ID *'], ['certificateNo', 'Certificate Number *'],
            ['studentName', 'Student Name *'], ['email', 'Email'], ['collegeName', 'College'],
            ['branch', 'Branch'], ['year', 'Year'], ['internshipId', 'Internship ID'],
            ['internshipFromDate', 'Internship Start Date', 'date'], ['internshipToDate', 'Internship End Date', 'date'],
            ['projectTitle', 'Project Title'], ['courseName', 'Internship / Course *'],
            ['duration', 'Duration'], ['completionDate', 'Certificate Date *', 'date'],
          ].map(([name, label, type = 'text']) => (
            <label key={name} className="text-sm text-slate-600">
              {label}
              <input className="input-field mt-1" name={name} type={type} value={form[name]} onChange={updateField} required={label.includes('*')} />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" accept="application/pdf,.pdf" onChange={(event) => setPdf(event.target.files?.[0] || null)} required className="text-sm" />
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> {saving ? 'Adding...' : 'Add & Verify'}
          </button>
        </div>
      </form>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 dark:bg-brand-900">
            <tr>
              <th className="text-left p-4">Certificate ID</th>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4 hidden sm:table-cell">Course</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.data?.map((c) => (
              <tr key={c._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 font-mono text-xs">{c.certificateId}</td>
                <td className="p-4">{c.studentName || c.user?.fullName}</td>
                <td className="p-4 hidden sm:table-cell">{c.courseName}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {c.certificateUrl && (
                      <a href={resolveFileUrl(c.certificateUrl)} target="_blank" rel="noreferrer" className="text-brand-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" /> View PDF
                      </a>
                    )}
                    <Link to={`/verify/${c.certificateId}`} className="text-brand-600 flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> Verify
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCertificates;
