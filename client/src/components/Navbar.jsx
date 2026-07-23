import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LogoMark from './LogoMark';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/internships', label: 'Internships' },
  { to: '/salesforce', label: 'Salesforce' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/verify', label: 'Verify Certificate' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-brand-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2 group">
              <LogoMark size={40} className="hidden sm:block" />
              <LogoMark size={34} className="sm:hidden" />
            <div>
                <span className="font-display font-bold text-xl text-brand-900 dark:text-white">CampusCode Labs</span>
                <p className="text-[10px] text-brand-600 -mt-1 hidden sm:block">THINK. CODE. DELIVER.</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 bg-brand-50 dark:bg-brand-800/50 shadow-[0_0_18px_rgba(10,132,255,0.20)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-brand-400 hover:bg-white/5 dark:hover:bg-brand-800/30 hover:shadow-[0_0_18px_rgba(10,132,255,0.25)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/apply" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
              Apply Now
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-800 transition-colors" aria-label="Toggle theme">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-4"
            >
              <div className="px-4 mb-3">
                <div className="flex items-center gap-3">
                  <LogoMark size={38} />
                  <div>
                    <p className="font-display font-bold text-brand-900 dark:text-white">CampusCode Labs</p>
                    <p className="text-[11px] text-brand-600 -mt-1">THINK. CODE. DELIVER.</p>
                  </div>
                </div>
              </div>
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="block py-2 text-slate-600 dark:text-slate-400">
                  {link.label}
                </NavLink>
              ))}
              <Link to="/apply" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 mt-3 inline-flex">
                Apply Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
