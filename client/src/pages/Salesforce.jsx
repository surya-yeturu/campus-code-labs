import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Cloud, Code, DollarSign, Globe, Briefcase, Building2,
  Award, Users, BookOpen, Headphones, FileText, Target, MessageSquare,
  ChevronDown, Send, CheckCircle, Laptop, Zap, Shield, TrendingUp,
  GraduationCap, ClipboardList, GitBranch, Layers, Database, Workflow,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const whySalesforceBenefits = [
  { icon: DollarSign, title: 'High Salary', desc: 'Salesforce professionals earn premium packages globally.' },
  { icon: TrendingUp, title: 'Huge Demand', desc: 'One of the fastest-growing tech skills in the job market.' },
  { icon: Globe, title: 'Remote Opportunities', desc: 'Work from anywhere with global Salesforce roles.' },
  { icon: Building2, title: 'MNC Jobs', desc: 'Top multinational companies hire Salesforce talent.' },
  { icon: Laptop, title: 'Product Companies', desc: 'Build on the world\'s #1 CRM platform.' },
  { icon: Briefcase, title: 'Consulting Companies', desc: 'Join leading Salesforce consulting partners.' },
  { icon: Award, title: 'Global Certifications', desc: 'Industry-recognized Salesforce credentials.' },
];

const whyCampusCode = [
  { icon: Target, title: 'Real-Time Projects', desc: 'Build enterprise-grade Salesforce CRM solutions.' },
  { icon: Users, title: 'Live Classes', desc: 'Interactive sessions with expert instructors.' },
  { icon: ClipboardList, title: 'Assignments', desc: 'Hands-on practice after every module.' },
  { icon: Headphones, title: 'Doubt Support', desc: 'Dedicated mentor support throughout the program.' },
  { icon: MessageSquare, title: 'Interview Preparation', desc: 'Crack Salesforce interviews with confidence.' },
  { icon: FileText, title: 'Resume Building', desc: 'Craft a professional Salesforce-focused resume.' },
  { icon: Users, title: 'Mock Interviews', desc: 'Practice with real interview scenarios.' },
  { icon: GraduationCap, title: 'Career Guidance', desc: 'Personalized career roadmap and mentorship.' },
  { icon: Briefcase, title: 'Placement Assistance', desc: 'Connect with hiring partners and opportunities.' },
  { icon: Award, title: 'Certificate', desc: 'Program completion certificate from CampusCode Labs.' },
  { icon: Users, title: 'Lifetime Community', desc: 'Stay connected with alumni and mentors forever.' },
];

const curriculumModules = [
  { title: 'Module 1', topic: 'Salesforce Admin Configuration' },
  { title: 'Module 2', topic: 'Salesforce Technical Concepts' },
  { title: 'Module 3', topic: 'Salesforce Lightning' },
];

const projectFeatures = [
  'Requirements Gathering', 'Objects', 'Automation', 'Approval Processes',
  'Apex', 'LWC', 'Reports', 'Dashboards', 'Deployment', 'Git', 'Agile',
];

const careerRoles = [
  { icon: Code, title: 'Salesforce Developer', desc: 'Build custom apps, Apex, LWC, and integrations.' },
  { icon: Shield, title: 'Salesforce Administrator', desc: 'Configure orgs, users, security, and workflows.' },
  { icon: Layers, title: 'CRM Consultant', desc: 'Design CRM solutions for business needs.' },
  { icon: Database, title: 'Business Analyst', desc: 'Bridge business requirements and technical solutions.' },
  { icon: Workflow, title: 'Technical Consultant', desc: 'Implement complex Salesforce implementations.' },
  { icon: Zap, title: 'Solution Engineer', desc: 'Architect scalable Salesforce solutions.' },
];

const faqs = [
  { q: 'Who can join the Salesforce Training Program?', a: 'Students, graduates, and working professionals with any technical or non-technical background can apply. No prior Salesforce experience is required.' },
  { q: 'Is this an internship or a training program?', a: 'This is a dedicated Salesforce Training Program — not an internship. It includes live classes, real-time projects, and career guidance.' },
  { q: 'What is the duration of the program?', a: 'The program is structured over several months with live classes, assignments, and a capstone real-time project. Batch schedules include Morning, Evening, and Weekend options.' },
  { q: 'Do I need coding experience?', a: 'Basic logical thinking helps, but we start from fundamentals. Apex and LWC modules are taught step-by-step with hands-on practice.' },
  { q: 'Will I work on a real project?', a: 'Yes. You will build an enterprise-level Salesforce CRM project covering requirements, objects, automation, Apex, LWC, reports, dashboards, and deployment.' },
  { q: 'Is placement assistance provided?', a: 'Yes. We offer resume building, mock interviews, interview preparation, and placement assistance to help you land Salesforce roles.' },
  { q: 'Will I receive a certificate?', a: 'Yes. You will receive a CampusCode Labs program completion certificate upon successfully finishing the training.' },
  { q: 'What batches are available?', a: 'We offer Morning, Evening, and Weekend batches. Select your preferred batch when applying.' },
  { q: 'Can working professionals join?', a: 'Absolutely. The program is designed for students, graduates, and working professionals. Weekend and evening batches suit working schedules.' },
  { q: 'How do I apply?', a: 'Click Apply Now, fill in the application form with your details, and our team will contact you with the next steps.' },
];

const floatingIcons = [Cloud, Code, Database, Workflow, Layers, GitBranch];

const Accordion = ({ items }) => {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.q || item.title} className="glass-card overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            className="w-full flex items-center justify-between p-5 text-left font-medium text-brand-900 dark:text-white hover:bg-brand-50/50 dark:hover:bg-brand-800/30 transition-colors"
          >
            <span>{item.q || `${item.title}: ${item.topic}`}</span>
            <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-slate-600 dark:text-slate-400">
                  {item.a || `Comprehensive training on ${item.topic} with live examples, assignments, and hands-on practice.`}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const SalesforceApplyForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', college: '', branch: '',
    passingYear: '', location: '', currentStatus: '', experience: '',
    interestedRole: '', preferredBatch: '', reason: '', agreed: false,
  });
  const [resumeFile, setResumeFile] = useState(null);
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agreed) {
      toast.error('Please agree to be contacted by CampusCode Labs');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resumeFile) fd.append('resume', resumeFile);
      await api.post('/salesforce/apply', fd);
      toast.success('Application submitted! Our team will contact you soon.');
      setForm({
        fullName: '', phone: '', email: '', college: '', branch: '',
        passingYear: '', location: '', currentStatus: '', experience: '',
        interestedRole: '', preferredBatch: '', reason: '', agreed: false,
      });
      setResumeFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="glass-card p-8 space-y-5"
    >
      {[
        { name: 'fullName', label: 'Full Name', type: 'text' },
        { name: 'phone', label: 'Phone Number', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'college', label: 'College Name', type: 'text' },
        { name: 'branch', label: 'Branch', type: 'text' },
        { name: 'passingYear', label: 'Passing Year', type: 'text' },
        { name: 'location', label: 'Current Location', type: 'text' },
      ].map((field) => (
        <div key={field.name}>
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type={field.type}
            required
            className="input-field mt-1"
            value={form[field.name]}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
          />
        </div>
      ))}

      <div>
        <label className="text-sm font-medium">Current Status</label>
        <select required className="input-field mt-1" value={form.currentStatus} onChange={(e) => setForm({ ...form, currentStatus: e.target.value })}>
          <option value="">Select status</option>
          <option value="Student">Student</option>
          <option value="Graduate">Graduate</option>
          <option value="Working Professional">Working Professional</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Experience</label>
        <select required className="input-field mt-1" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
          <option value="">Select experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0-1 Years">0-1 Years</option>
          <option value="1-2 Years">1-2 Years</option>
          <option value="2+ Years">2+ Years</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Interested In</label>
        <select required className="input-field mt-1" value={form.interestedRole} onChange={(e) => setForm({ ...form, interestedRole: e.target.value })}>
          <option value="">Select role</option>
          <option value="Salesforce Developer">Salesforce Developer</option>
          <option value="Salesforce Administrator">Salesforce Administrator</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Preferred Batch</label>
        <select required className="input-field mt-1" value={form.preferredBatch} onChange={(e) => setForm({ ...form, preferredBatch: e.target.value })}>
          <option value="">Select batch</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Weekend">Weekend</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Why Salesforce?</label>
        <textarea
          required
          rows={4}
          className="input-field mt-1 resize-none"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          placeholder="Tell us why you want to learn Salesforce..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Resume Upload (optional)</label>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="input-field mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-600 file:text-white file:cursor-pointer"
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        />
      </div>

      <label className="flex items-start gap-3 text-slate-800 dark:text-slate-200">
        <input
          type="checkbox"
          required
          checked={form.agreed}
          onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          className="h-5 w-5 mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span>I agree to be contacted by CampusCode Labs.</span>
      </label>

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
        {submitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Application</>}
      </button>
    </motion.form>
  );
};

const Salesforce = () => {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCurriculum = () => {
    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] bg-hero-gradient overflow-hidden">
        {floatingIcons.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{ left: `${8 + i * 14}%`, top: `${15 + (i % 3) * 28}%` }}
            animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          >
            <Icon className="w-14 h-14 md:w-20 md:h-20" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,132,255,0.15),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-brand-200 text-sm font-medium backdrop-blur mb-6">
              <Cloud className="w-4 h-4 mr-2" /> Exclusive Training Program
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              Become a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-400">
                Salesforce Developer
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl">
              Learn Salesforce Development with Live Classes, Real-Time Projects, Mentor Support, and Career Guidance.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={scrollToForm} className="btn-primary text-lg px-8 py-4">
                Apply Now <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={scrollToCurriculum}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:border-brand-400 hover:bg-white/5 transition-all"
              >
                View Curriculum
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Salesforce */}
      <section className="py-20 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Salesforce?</h2>
            <p className="section-subtitle mx-auto mt-4">
              Salesforce is the world&apos;s #1 CRM platform — powering businesses across every industry.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {whySalesforceBenefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 hover:shadow-premium transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CampusCode Labs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose CampusCode Labs</h2>
            <p className="section-subtitle mx-auto mt-4">
              Everything you need to become a job-ready Salesforce professional
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCampusCode.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-6 flex gap-4 hover:shadow-premium transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-600/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 bg-white dark:bg-brand-900">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Course Curriculum</h2>
            <p className="section-subtitle mx-auto mt-4">Three focused modules covering admin, technical, and Lightning skills</p>
          </div>
          <Accordion items={curriculumModules} />
        </div>
      </section>

      {/* Real-Time Project */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-card p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="section-title mb-4">Real-Time Project</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Work on an enterprise-level Salesforce CRM project that mirrors real industry implementations.
                  Gain hands-on experience across the full Salesforce development lifecycle.
                </p>
                <div className="flex flex-wrap gap-3">
                  {projectFeatures.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-sm">
                      <CheckCircle className="w-3.5 h-3.5" /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-brand-600/20 to-brand-800/40 flex items-center justify-center border border-brand-500/20">
                  <div className="text-center p-8">
                    <Cloud className="w-16 h-16 text-brand-400 mx-auto mb-4" />
                    <p className="font-display font-bold text-xl text-brand-900 dark:text-white">Enterprise CRM Project</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">End-to-end Salesforce implementation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-20 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Career Opportunities</h2>
            <p className="section-subtitle mx-auto mt-4">Roles you can pursue after completing the program</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerRoles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-6 text-center hover:shadow-premium transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4">
                  <role.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{role.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Next Salesforce Batch
            </h2>
            <p className="text-slate-300 mb-8">Limited seats available. Start your Salesforce career today.</p>
            <button onClick={scrollToForm} className="btn-primary text-lg px-10 py-4">
              Apply Now <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section ref={formRef} className="py-20 bg-white dark:bg-brand-900">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title">Apply for Salesforce Training</h2>
            <p className="section-subtitle mx-auto mt-4">
              Fill in your details and our team will get in touch with you.
            </p>
          </div>
          <SalesforceApplyForm />
        </div>
      </section>
    </div>
  );
};

export default Salesforce;
