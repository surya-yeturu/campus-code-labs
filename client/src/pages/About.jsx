import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';

const About = () => (
  <div className="py-12">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">About Campus Code Labs</h1>
        <p className="section-subtitle mx-auto mt-4">
          A software development company and technology training platform building future-ready talent.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: Target, title: 'Our Mission', text: 'Deliver industry-ready software solutions and internship programs that bridge the gap between academia and technology.' },
          { icon: Eye, title: 'Our Vision', text: 'Become India\'s most trusted software company and internship provider for students and businesses.' },
          { icon: Heart, title: 'Our Values', text: 'Innovation, integrity, quality delivery, and excellence in every project and program we undertake.' },
          { icon: Users, title: 'Our Community', text: 'Join 5000+ developers and students who have built real skills and careers through Campus Code Labs.' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8">
            <item.icon className="w-10 h-10 text-brand-600 mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
