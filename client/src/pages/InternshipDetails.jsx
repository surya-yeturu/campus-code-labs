import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Clock, Wifi, CheckCircle,
  BookOpen, Award, FolderKanban,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { DURATION_OPTIONS } from '../utils/internshipPricing';

const benefits = [
  'Offer Letter on enrollment',
  'Internship Certificate',
  'Recommendation Letter (on approval)',
  'Project Guidance from mentors',
  'Learning Materials & Notes',
  'Industry Exposure',
];

const durationLabel = DURATION_OPTIONS.map((duration) => duration.replace(' Weeks', '')).join(', ');

const InternshipDetails = () => {
  const { slug } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then(({ data }) => setInternship(data.data))
      .catch(() => setInternship(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!internship) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Internship program not found.</p>
        <Link to="/internships" className="btn-primary mt-6 inline-flex">Browse Programs</Link>
      </div>
    );
  }

  const projects = internship.skills?.slice(0, 4) || [];

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-2xl mb-6">
            {internship.title.charAt(0)}
          </div>
          <h1 className="section-title">{internship.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">{internship.description}</p>

          <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-2 glass-card px-4 py-2">
              <Clock className="w-4 h-4 text-brand-600" /> {durationLabel} Weeks
            </span>
            <span className="flex items-center gap-2 glass-card px-4 py-2">
              <Wifi className="w-4 h-4 text-brand-600" /> {internship.mode}
            </span>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mt-10"
        >
          <h2 className="font-display font-bold text-xl mb-4">Overview</h2>
          <p className="text-slate-600 dark:text-slate-400">{internship.description}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-8 mt-6"
        >
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" /> Technologies Covered
          </h2>
          <div className="flex flex-wrap gap-2">
            {internship.skills?.map((skill) => (
              <span key={skill} className="text-sm px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-800/50 text-brand-700 dark:text-brand-300">
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mt-6"
        >
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-600" /> Projects Included
          </h2>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" /> {p} Project
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-8 mt-6"
        >
          <h2 className="font-display font-bold text-xl mb-4">Internship Benefits</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" /> {b}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mt-6"
        >
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-600" /> Certificate Details
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Receive a verifiable internship certificate with unique ID and QR code.
            Certificates can be verified publicly at our verification page.
          </p>
        </motion.section>

        <div className="mt-10 text-center">
          <Link to={`/apply/${slug}`} className="btn-primary text-lg px-8 py-4 inline-flex">
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
