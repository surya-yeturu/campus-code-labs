import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { DURATION_OPTIONS, parseDurationWeeks } from '../utils/internshipPricing';

const fallbackProjects = [
  'Student Portfolio Management Platform',
  'Online Internship Application Tracker',
  'Smart Certificate Verification System',
  'Campus Event Registration Portal',
];

const terms = [
  {
    title: 'Accurate Information',
    text: 'Please enter your full name and email address accurately. Any spelling mistakes will be final, and no rectifications can be made later.',
  },
  {
    title: 'No Changes Allowed',
    text: 'Once submitted, there will be no changes permitted to your name, domain, batch, duration, or dates.',
  },
  {
    title: 'No Cancellations',
    text: 'Once you accept the offer, cancellations will not be entertained.',
  },
  {
    title: 'No Refunds',
    text: 'All payments made are non-refundable under any circumstances.',
  },
  {
    title: 'Compliance Required',
    text: 'By proceeding with the application, you agree to adhere to these terms and conditions in their entirety.',
  },
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
    termsAccepted: false,
  });

  useEffect(() => {
    api.get('/courses').then(({ data }) => {
      const list = data.data || [];
      setInternships(list);
      if (slug) {
        const selected = list.find((c) => c.slug === slug);
        if (selected) {
          const duration = DURATION_OPTIONS.includes(selected.duration) ? selected.duration : '8 Weeks';
          setForm((f) => ({
            ...f,
            duration,
            internshipSlug: slug,
            projectTitle: '',
            internshipToDate: calcEndDate(f.internshipFromDate, duration),
          }));
        }
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  const selectedInternship = internships.find((c) => c.slug === form.internshipSlug);
  const projectOptions = getProjectOptions(selectedInternship);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.internshipSlug || !selectedInternship) {
      toast.error('Please select an internship program');
      return;
    }
    if (!form.internshipFromDate || !form.duration) {
      toast.error('Please select duration and start date');
      return;
    }
    if (!form.internshipToDate) {
      toast.error('End date could not be calculated. Check duration and start date.');
      return;
    }
    if (!form.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        collegeName: form.collegeName.trim(),
        branch: form.branch.trim(),
        year: form.year,
        duration: form.duration,
        internshipFromDate: form.internshipFromDate,
        internshipToDate: form.internshipToDate,
        projectTitle: form.projectTitle,
        courseId: selectedInternship._id,
      };

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-6"
        >
          <h2 className="font-display text-xl font-bold mb-5">
            Terms & Conditions <span className="text-red-500">*</span>
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            {terms.map((term) => (
              <li key={term.title}>
                <strong>{term.title}:</strong> {term.text}
              </li>
            ))}
          </ol>
          <label className="mt-8 flex items-center gap-3 text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              required
              checked={form.termsAccepted}
              onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Yes, I agree.</span>
          </label>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
              {DURATION_OPTIONS.map((d) => (
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
                const duration = DURATION_OPTIONS.includes(selected?.duration) ? selected.duration : '8 Weeks';
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
