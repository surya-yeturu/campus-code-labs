import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle mx-auto mt-4">We&apos;d love to hear from you</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'support@campuscodelabs.com' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Location', value: 'India' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 glass-card p-4">
                <item.icon className="w-8 h-8 text-brand-600" />
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
            <input className="input-field" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea className="input-field min-h-[120px]" placeholder="Message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button type="submit" className="btn-primary w-full"><Send className="w-5 h-5" /> Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
