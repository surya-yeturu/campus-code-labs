import { motion } from 'framer-motion';
import LogoMark from './LogoMark';

const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
    <div className="flex flex-col items-center gap-4">
      {fullScreen && <LogoMark size={56} className="drop-shadow-[0_0_24px_rgba(10,132,255,0.35)]" />}
      <motion.div
        className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  </div>
);

export default LoadingSpinner;
