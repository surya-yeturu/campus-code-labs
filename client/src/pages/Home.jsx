import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Users, BookOpen, Briefcase,
  Code, Database, Brain, Lock, Palette, Globe, ChevronLeft, ChevronRight,
  Award, FileText, GraduationCap, Headphones, Target, Search,
} from 'lucide-react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import AnimatedCounter from '../components/AnimatedCounter';
import LoadingSpinner from '../components/LoadingSpinner';
import LogoMark from '../components/LogoMark';

const whyCards = [
  { icon: Briefcase, title: 'Industry Projects', desc: 'Work on real-world projects that mirror industry standards and workflows.' },
  { icon: Users, title: 'Internship Programs', desc: 'Structured programs across full stack, data science, AI, and more.' },
  { icon: Headphones, title: 'Expert Mentorship', desc: 'Guidance from experienced developers and industry professionals.' },
  { icon: Award, title: 'Certifications', desc: 'Verifiable internship certificates with unique IDs and QR codes.' },
  { icon: Target, title: 'Placement Assistance', desc: 'Career support to help you transition from learning to employment.' },
  { icon: GraduationCap, title: 'Real World Learning', desc: 'Project-based learning that builds practical, job-ready skills.' },
];

const serviceCards = [
  { icon: Code, title: 'Web Development', desc: 'Modern UIs, robust APIs, and scalable architecture.' },
  { icon: Database, title: 'Mobile App Development', desc: 'Cross-platform apps with smooth UX and reliable releases.' },
  { icon: BookOpen, title: 'Final Year Projects', desc: 'Mentor-guided delivery with production-ready outcomes.' },
  { icon: Brain, title: 'AI Solutions', desc: 'Practical AI from prototypes to real workflows.' },
  { icon: Palette, title: 'Custom Software Development', desc: 'Tailored solutions built for your business needs.' },
  { icon: Globe, title: 'SaaS Development', desc: 'End-to-end SaaS product development from MVP to launch.' },
];

const benefitCards = [
  { icon: FileText, title: 'Offer Letter', desc: 'Official offer letter upon enrollment approval.' },
  { icon: Award, title: 'Internship Certificate', desc: 'Verifiable certificate with QR code for authenticity.' },
  { icon: FileText, title: 'Recommendation Letter', desc: 'Professional recommendation on admin approval.' },
  { icon: Briefcase, title: 'Project Guidance', desc: 'Step-by-step mentorship on real industry projects.' },
  { icon: BookOpen, title: 'Learning Materials', desc: 'Curated notes, PDFs, and resource links.' },
  { icon: Users, title: 'Industry Exposure', desc: 'Experience workflows used by top tech companies.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'CS Student, IIT', text: 'Campus Code Labs made my MERN internship seamless. The mentorship and project guidance were exceptional.', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Science Enthusiast', text: 'From application to certification, the entire process felt professional and industry-aligned.', rating: 5 },
  { name: 'Ananya Patel', role: 'UI/UX Designer', text: 'The internship program gave me real portfolio projects and a verifiable certificate employers trust.', rating: 5 },
];

const faqs = [
  { q: 'How do I apply for an internship?', a: 'Click Apply Now, fill in your details, and submit your application. No account is required to apply.' },
  { q: 'Are certificates verifiable?', a: 'Yes! Every certificate has a unique ID and QR code. Anyone can verify authenticity on our verification page.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI payments. After applying, you will receive payment instructions to complete enrollment.' },
  { q: 'Do you offer software development services?', a: 'Yes. We provide web development, mobile apps, AI solutions, final year projects, and custom software for businesses.' },
];

const floatingIcons = [Code, Database, Brain, Lock, Palette, Globe];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [verifyId, setVerifyId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then(({ data }) => {
      setCourses(data.data?.slice(0, 8) || []);
    }).catch(() => setCourses([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] bg-hero-gradient overflow-hidden">
        {floatingIcons.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          >
            <Icon className="w-12 h-12 md:w-16 md:h-16" />
          </motion.div>
        ))}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-6">
              <LogoMark size={44} className="drop-shadow-[0_0_24px_rgba(10,132,255,0.35)]" />
              <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-brand-200 text-sm font-medium backdrop-blur">
                THINK. CODE. DELIVER.
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              Building{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-400">
                Future-Ready Talent
              </span>{' '}
              &amp; Software Solutions
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl">
              Industry-focused internships, project-based learning, web development services, AI solutions, and technology consulting.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/internships" className="btn-primary text-lg px-8 py-4">
                Explore Internships <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:border-brand-400 hover:bg-white/5 hover:shadow-[0_0_22px_rgba(10,132,255,0.35)] transition-all"
              >
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-brand-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 5000, suffix: '+', label: 'Students Enrolled' },
            { end: 8, suffix: '+', label: 'Internship Programs' },
            { end: 4500, suffix: '+', label: 'Certificates Issued' },
            { end: 98, suffix: '%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-display font-bold text-brand-700 dark:text-brand-400">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Campus Code Labs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Campus Code Labs</h2>
            <p className="section-subtitle mx-auto mt-4">Your partner in technology education and software delivery</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                <f.icon className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Programs */}
      <section className="py-20 bg-brand-50 dark:bg-brand-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Internship Programs</h2>
            <p className="section-subtitle mx-auto mt-4">Choose from industry-leading internship tracks</p>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((c, i) => <CourseCard key={c._id} course={c} index={i} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/internships" className="btn-outline">View All Internships</Link>
          </div>
        </div>
      </section>

      {/* Software Services */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center mb-4">Software Services</h2>
          <p className="section-subtitle text-center mx-auto mb-12">
            Premium delivery across software, AI, and technology consulting.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                <f.icon className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Student Benefits */}
      <section className="py-20 bg-brand-50 dark:bg-brand-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center mb-12">Student Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitCards.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex items-start gap-4">
                <b.icon className="w-10 h-10 text-brand-600 shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">{b.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Verification */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Award className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h2 className="section-title mb-4">Certificate Verification</h2>
          <p className="section-subtitle mx-auto mb-8">Verify the authenticity of any Campus Code Labs certificate</p>
          <div className="glass-card p-6 flex gap-2 max-w-lg mx-auto">
            <input
              className="input-field flex-1"
              placeholder="Certificate ID or Internship ID"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyId.trim() && navigate(`/verify/${verifyId.trim()}`)}
            />
            <button
              onClick={() => verifyId.trim() && navigate(`/verify/${verifyId.trim()}`)}
              className="btn-primary px-6"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <Link to="/verify" className="text-brand-600 text-sm mt-4 inline-block hover:underline">Advanced verification options</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-10">Student Success Stories</h2>
          <motion.div key={testimonialIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 bg-white/10 border-white/20">
            <p className="text-white text-lg italic">&ldquo;{testimonials[testimonialIdx].text}&rdquo;</p>
            <p className="text-brand-300 font-semibold mt-4">{testimonials[testimonialIdx].name}</p>
            <p className="text-slate-400 text-sm">{testimonials[testimonialIdx].role}</p>
          </motion.div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-full bg-white/10 text-white"><ChevronLeft /></button>
            <button onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)} className="p-2 rounded-full bg-white/10 text-white"><ChevronRight /></button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="glass-card p-6 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <CheckCircle className="w-5 h-5 text-brand-600 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center glass-card p-12 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Build Something Future-Ready?</h2>
          <p className="text-brand-100 mb-8">
            Whether you need an internship, a final year project, or custom software — we&apos;re here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-bold hover:scale-105 transition-transform">
              Apply Now <ArrowRight />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:border-brand-400 hover:bg-white/5 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
