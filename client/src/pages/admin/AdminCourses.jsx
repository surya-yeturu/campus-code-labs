import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then(({ data }) => setCourses(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Courses Management</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <div key={c._id} className="glass-card p-6">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{c.duration} | ₹{c.price} | {c.mode}</p>
            <p className="text-sm mt-2">{c.enrolledCount || 0} enrolled</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {c.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
