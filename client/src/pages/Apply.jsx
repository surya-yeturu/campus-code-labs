import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const fallbackProjects = [
  'Student Portfolio Management Platform',
  'Online Internship Application Tracker',
  'Smart Certificate Verification System',
  'Campus Event Registration Portal',
];

const projectTitlesByDomain = [
  {
    keywords: ['mern', 'full stack', 'web', 'react', 'node', 'javascript'],
    projects: [
      'MERN Stack Internship Management Portal',
      'Real-Time Project Collaboration Dashboard',
      'Online Certificate Verification Web App',
      'College Placement and Training Portal',
    ],
  },
  {
    keywords: ['python', 'django', 'flask'],
    projects: [
      'Python-Based Student Performance Analyzer',
      'Automated Resume Screening System',
      'Django Internship Tracking Portal',
      'Smart Attendance Management System',
    ],
  },
  {
    keywords: ['data', 'analytics', 'science', 'machine learning'],
    projects: [
      'Student Placement Prediction Using Machine Learning',
      'Sales Insights Dashboard Using Python',
      'Customer Churn Analysis Model',
      'Academic Performance Analytics Dashboard',
    ],
  },
  {
    keywords: ['ai', 'artificial intelligence', 'deep learning', 'gen ai'],
    projects: [
      'AI Chatbot for Student Support',
      'Resume Parser Using Natural Language Processing',
      'AI-Based Interview Question Generator',
      'Image Classification Web Application',
    ],
  },
  {
    keywords: ['cyber', 'security', 'ethical hacking'],
    projects: [
      'Three-Level Password Authentication System',
      'Phishing Website Detection Tool',
      'Secure File Encryption Application',
      'Network Vulnerability Scanner Dashboard',
    ],
  },
  {
    keywords: ['ui', 'ux', 'design', 'figma'],
    projects: [
      'Mobile Banking App UI/UX Case Study',
      'E-Learning Platform Design System',
      'Internship Portal User Experience Redesign',
      'Food Delivery App Prototype',
    ],
  },
  {
    keywords: ['mobile', 'android', 'flutter', 'react native'],
    projects: [
      'Flutter Student Companion App',
      'Android Task and Attendance Tracker',
      'Mobile Internship Progress Tracker',
      'React Native Campus Connect App',
    ],
  },
  {
    keywords: ['cloud', 'devops', 'aws', 'docker'],
    projects: [
      'Dockerized MERN Application Deployment',
      'CI/CD Pipeline for Web Applications',
      'Cloud-Based File Backup System',
      'AWS Hosted Student Portal',
    ],
  },
];

const getProjectOptions = (internship) => {
  if (!internship) return [];
  const text = [internship.title, internship.description, ...(internship.skills || [])].join(' ').toLowerCase();
  return projectTitlesByDomain.find((domain) => domain.keywords.some((keyword) => text.includes(keyword)))?.projects || fallbackProjects;
};

const parseDurationWeeks = (duration) => {
  const match = String(duration).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const calcEndDate = (startDate, duration) => {
  if (!startDate || !duration) return '';
  const weeks = parseDurationWeeks(duration);
  if (!weeks) return '';
  const [year, month, day] = startDate.split('-').map(Number);
  const end = new Date(year, month - 1, day);
  end.setDate(end.getDate() + weeks * 7);
  return [
    end.getFullYear(),
    String(end.getMonth() + 1).padStart(2, '0'),
    String(end.getDate()).padStart(2, '0'),
  ].join('-');
};

const Apply = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    branch: '',
    year: '',
    duration: '',
    internshipFromDate: '',
    internshipToDate: '',
    internshipSlug: slug || '',
    projectTitle: '',
  });

  useEffect(() => {
    api.get('/courses').then(({ data }) => {
      const list = data.data || [];
      setInternships(list);
      if (slug) {
        const selected = list.find((c) => c.slug === slug);
        if (selected) {
          setForm((f) => ({
            ...f,
            duration: selected.duration,
            internshipSlug: slug,
            projectTitle: '',
            internshipToDate: calcEndDate(f.internshipFromDate, selected.duration),
          }));
        }
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  const selectedInternship = internships.find((c) => c.slug === form.internshipSlug);
  const projectOptions = getProjectOptions(selectedInternship);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.internshipSlug) {
      toast.error('Please select an internship program');
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) payload.append(key, val);
      });
      if (selectedInternship) payload.append('courseId', selectedInternship._id);

      const { data } = await api.post('/applications', payload);
      toast.success('Application submitted! Complete payment to proceed.');
      const appId = data.data?.applicationId;
      if (appId) {
        navigate(`/apply/payment/${appId}?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="py-12 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">Apply for Internship</h1>
          <p className="section-subtitle mx-auto mt-4">
            No account required. Submit your details, complete payment, and receive your certificate by email after approval.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 space-y-5"
        >
          {[
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            { name: 'collegeName', label: 'College Name', type: 'text', required: true },
            { name: 'branch', label: 'Branch', type: 'text', required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type={field.type}
                required={field.required}
                className="input-field mt-1"
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Year</label>
            <select
              required
              className="input-field mt-1"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Duration</label>
            <select
              required
              className="input-field mt-1"
              value={form.duration}
              onChange={(e) => {
                const duration = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  duration,
                  internshipToDate: calcEndDate(prev.internshipFromDate, duration),
                }));
              }}
            >
              <option value="">Select duration</option>
              {['4 Weeks', '6 Weeks', '8 Weeks', '10 Weeks', '12 Weeks'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Internship From Date</label>
              <input
                type="date"
                required
                className="input-field mt-1"
                value={form.internshipFromDate}
                onChange={(e) => {
                  const internshipFromDate = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    internshipFromDate,
                    internshipToDate: calcEndDate(internshipFromDate, prev.duration),
                  }));
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Internship To Date</label>
              <input
                type="date"
                required
                className="input-field mt-1"
                min={form.internshipFromDate || undefined}
                value={form.internshipToDate}
                onChange={(e) => setForm({ ...form, internshipToDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Internship Selected</label>
            <select
              required
              className="input-field mt-1"
              value={form.internshipSlug}
              onChange={(e) => {
                const selected = internships.find((c) => c.slug === e.target.value);
                const duration = selected?.duration || '';
                setForm((prev) => ({
                  ...prev,
                  internshipSlug: e.target.value,
                  duration,
                  projectTitle: '',
                  internshipToDate: calcEndDate(prev.internshipFromDate, duration),
                }));
              }}
            >
              <option value="">Select internship</option>
              {internships.map((c) => (
                <option key={c._id} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Project Selection</label>
            <select
              required
              className="input-field mt-1"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              disabled={!selectedInternship}
            >
              <option value="">{selectedInternship ? 'Select project title' : 'Select internship first'}</option>
              {projectOptions.map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Application</>}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Apply;
