import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Code, Smartphone, GraduationCap, Brain, Layers, Cloud,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Web Development',
    desc: 'Modern, responsive web applications with robust APIs and scalable architecture.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    desc: 'Cross-platform mobile apps with smooth UX and reliable releases.',
  },
  {
    icon: GraduationCap,
    title: 'Final Year Projects',
    desc: 'Mentor-guided final year projects with production-ready deliverables.',
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    desc: 'Practical AI and machine learning from prototypes to real workflows.',
  },
  {
    icon: Layers,
    title: 'Custom Software Development',
    desc: 'Tailored software solutions built for your business requirements.',
  },
  {
    icon: Cloud,
    title: 'SaaS Development',
    desc: 'End-to-end SaaS product development from MVP to production.',
  },
];

const Services = () => (
  <div className="py-12">
    <div className="max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">Software Services</h1>
        <p className="section-subtitle mx-auto mt-4">
          Premium technology solutions for businesses, startups, and academic institutions
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 text-center"
          >
            <s.icon className="w-12 h-12 text-brand-600 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16 glass-card p-12 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0"
      >
        <h2 className="font-display text-2xl font-bold mb-4">Need a Custom Solution?</h2>
        <p className="text-brand-100 mb-8 max-w-xl mx-auto">
          From internships to enterprise software — Campus Code Labs delivers technology that works.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-bold hover:scale-105 transition-transform">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/internships" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:border-brand-400 hover:bg-white/5 transition-all">
            Explore Internships
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default Services;
