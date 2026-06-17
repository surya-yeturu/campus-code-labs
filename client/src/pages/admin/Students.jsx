import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchStudents = () => {
    setLoading(true);
    api.get('/admin/students', { params: { page, limit: 10, search } })
      .then(({ data }) => setStudents(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [page, search]);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Students Management</h2>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input className="input-field pl-10" placeholder="Search students..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 dark:bg-brand-900">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4 hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 hidden md:table-cell">College</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.data?.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-4 font-medium">{s.fullName}</td>
                    <td className="p-4 hidden sm:table-cell text-slate-500">{s.email}</td>
                    <td className="p-4 hidden md:table-cell text-slate-500">{s.collegeName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.pagination && (
            <div className="flex justify-center gap-2 mt-4">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-outline text-sm py-2">Prev</button>
              <span className="py-2 px-4">Page {page} of {students.pagination.pages}</span>
              <button disabled={page >= students.pagination.pages} onClick={() => setPage(page + 1)} className="btn-outline text-sm py-2">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Students;
