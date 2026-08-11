import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, GraduationCap, Code, FileText, Users, CheckCircle,
  Sparkles, Layers, MessageSquare, Phone,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const pricingContacts = [
  { display: '8985373780', tel: '8985373780' },
  { display: '6309135509', tel: '6309135509' },
];

const PricingContact = ({ className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <p className="text-sm font-medium text-brand-800 dark:text-brand-200">Call for pricing &amp; enquiries</p>
    <div className="flex flex-wrap gap-3">
      {pricingContacts.map((phone) => (
        <a
          key={phone.tel}
          href={`tel:+91${phone.tel}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-50 dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
        >
          <Phone className="w-4 h-4" />
          {phone.display}
        </a>
      ))}
    </div>
  </div>
);

const highlights = [
  { icon: Code, title: 'Complete Source Code', desc: 'Fully working project with clean, documented code delivered to you.' },
  { icon: FileText, title: 'Project Report', desc: 'Documentation and report support to help you present your project confidently.' },
  { icon: Users, title: 'Expert Guidance', desc: 'Built and reviewed by experienced developers who understand academic requirements.' },
  { icon: Layers, title: 'Latest Technologies', desc: 'Projects using modern stacks — web, mobile, AI, cloud, and more.' },
];

const FinalYearProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/final-year-projects/public')
      .then(({ data }) => setProjects(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative py-20 lg:py-28 bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,132,255,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-200 text-sm font-medium backdrop-blur mb-6">
              <GraduationCap className="w-4 h-4" /> Final Year Project Delivery
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
              We Build &amp; Deliver{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-400">
                Final Year Projects
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              Need a ready-made final year project or a custom one built for your requirements?
              CampusCode Labs delivers complete, industry-standard projects to students.
            </p>
            <p className="mt-4 text-brand-200 text-sm">
              Call <a href="tel:+918985373780" className="font-semibold text-white hover:underline">8985373780</a>
              {' '}or{' '}
              <a href="tel:+916309135509" className="font-semibold text-white hover:underline">6309135509</a>
              {' '}for pricing details.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#projects" className="btn-primary text-lg px-8 py-4">
                View Available Projects <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:border-brand-400 hover:bg-white/5 transition-all"
              >
                Request Custom Project
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose CampusCode Labs?</h2>
            <p className="section-subtitle mx-auto mt-4">
              Professional final year project delivery tailored for students
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Available Final Year Projects</h2>
            <p className="section-subtitle mx-auto mt-4">
              Browse our ready-to-deliver projects. Don&apos;t see what you need? We can build any project for you.
            </p>
            <div className="mt-6 flex justify-center">
              <PricingContact />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : projects.length === 0 ? (
            <div className="glass-card p-12 text-center max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Projects Coming Soon</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We&apos;re updating our project catalog. Contact us to discuss your final year project requirements.
              </p>
              <PricingContact className="mb-6 flex flex-col items-center" />
              <Link to="/contact" className="btn-primary inline-flex">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-600/10 flex items-center justify-center mb-4">
                    <GraduationCap className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">{project.description}</p>
                  {expandedId === project._id ? (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-brand-800 dark:text-brand-200 mb-2">About this project</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{project.about}</p>
                    </div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === project._id ? null : project._id)}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      {expandedId === project._id ? 'Show less' : 'Learn more'}
                    </button>
                    <Link to="/contact" className="text-sm font-medium text-slate-500 hover:text-brand-600 ml-auto inline-flex items-center gap-1">
                      Enquire <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-brand-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="section-title mb-4">Need a Custom Project?</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Have a unique idea or a specific technology requirement? We design and develop
                  custom final year projects based on your college guidelines and submission timeline.
                </p>
                <ul className="space-y-3">
                  {[
                    'Any domain — Web, Mobile, AI/ML, IoT, Cloud & more',
                    'Aligned with your university format and deadlines',
                    'Complete delivery with source code and documentation',
                    'Support until your project submission',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-800 mb-4">
                  <MessageSquare className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="font-display font-bold text-xl mb-2">Tell us your requirement</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  Share your project topic, tech stack, and deadline — we&apos;ll get back to you with pricing and details.
                </p>
                <PricingContact className="mb-6" />
                <Link to="/contact" className="btn-primary inline-flex">
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinalYearProjects;
