import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LogoMark from './LogoMark';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/internships', label: 'Internships' },
  { to: '/final-year-projects', label: 'Final Year Projects', shortLabel: 'Final Year' },
  { to: '/salesforce', label: 'Salesforce' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/verify', label: 'Verify Certificate', shortLabel: 'Verify' },
  { to: '/contact', label: 'Contact' },
];

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 xl:px-2.5 py-1.5 text-[13px] xl:text-sm font-medium transition-colors ${
    isActive
      ? 'text-brand-600 bg-brand-50 dark:bg-brand-800/50 shadow-[0_0_12px_rgba(10,132,255,0.18)]'
      : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-800/30'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-brand-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <nav className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 lg:gap-4 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <LogoMark size={36} className="hidden sm:block lg:hidden xl:block shrink-0" />
            <LogoMark size={32} className="sm:hidden shrink-0" />
            <LogoMark size={34} className="hidden lg:block xl:hidden shrink-0" />
            <div className="min-w-0">
              <span className="font-display font-bold text-base xl:text-lg text-brand-900 dark:text-white block truncate">
                CampusCode Labs
              </span>
              <p className="text-[9px] xl:text-[10px] text-brand-600 -mt-0.5 hidden md:block truncate">
                THINK. CODE. DELIVER.
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center min-w-0">
            <ul className="flex items-center justify-evenly w-full max-w-3xl xl:max-w-4xl mx-auto">
              {navLinks.map((link) => (
                <li key={link.to} className="flex-shrink-0">
                  <NavLink to={link.to} end={link.to === '/'} className={navLinkClass} title={link.label}>
                    <span className="xl:hidden">{link.shortLabel || link.label}</span>
                    <span className="hidden xl:inline">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
            <Link to="/apply" className="btn-primary text-xs xl:text-sm py-2 px-3 xl:px-4 hidden sm:inline-flex whitespace-nowrap">
              Apply Now
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-800 transition-colors"
              aria-label="Toggle theme"
            >
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
              <div className="px-2 mb-3">
                <div className="flex items-center gap-3">
                  <LogoMark size={38} />
                  <div>
                    <p className="font-display font-bold text-brand-900 dark:text-white">CampusCode Labs</p>
                    <p className="text-[11px] text-brand-600 -mt-1">THINK. CODE. DELIVER.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? 'text-brand-600 bg-brand-50 dark:bg-brand-800/50 font-medium'
                          : 'text-slate-600 dark:text-slate-400'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <Link to="/apply" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 mt-4 mx-1 inline-flex">
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
