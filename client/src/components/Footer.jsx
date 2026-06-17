import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import LogoMark from './LogoMark';

const Footer = () => (
  <footer className="bg-brand-950 text-slate-300 relative overflow-hidden">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-50"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 0%, rgba(10,132,255,0.35), transparent 45%), radial-gradient(circle at 80% 40%, rgba(10,132,255,0.25), transparent 50%)',
      }}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LogoMark size={40} />
            <div>
              <span className="font-display font-bold text-xl text-white">CampusCode Labs</span>
              <p className="text-[10px] text-brand-400 mt-0.5">THINK. CODE. DELIVER.</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">Premium IT & software development for real-world impact.</p>
          <p className="text-sm mt-4 text-slate-500">From final-year projects to production-ready apps and AI solutions.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { path: '/', label: 'Home' },
              { path: '/internships', label: 'Internships' },
              { path: '/services', label: 'Services' },
              { path: '/about', label: 'About' },
              { path: '/verify', label: 'Verify Certificate' },
              { path: '/contact', label: 'Contact' },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link to={path} className="hover:text-brand-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Final Year Projects</li>
            <li>Web Development</li>
            <li>Internship Programs</li>
            <li>AI/ML Solutions</li>
            <li>Mobile App Development</li>
            <li>UI/UX Design</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> support@campuscodelabs.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400" /> India</li>
          </ul>

          <div className="mt-6">
            <h4 className="font-semibold text-white mb-3">Follow</h4>
            <div className="flex items-center gap-3">
              <a aria-label="Twitter" href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4 text-brand-400" />
              </a>
              <a aria-label="LinkedIn" href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4 text-brand-400" />
              </a>
              <a aria-label="GitHub" href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Github className="w-4 h-4 text-brand-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} CampusCode Labs. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
