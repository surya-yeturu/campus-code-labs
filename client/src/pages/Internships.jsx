import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/courses').then(({ data }) => setInternships(data.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = internships.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title">Internship Programs</h1>
          <p className="section-subtitle mx-auto mt-4">
            Industry-focused programs with real projects, mentorship, and verified certification
          </p>
        </motion.div>
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search internships or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((c, i) => (
              <CourseCard key={c._id} course={c} index={i} />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No internships found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Internships;
