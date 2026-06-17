import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, IndianRupee, Wifi, ArrowRight } from 'lucide-react';
const CourseCard = ({ course, index = 0 }) => {
  const detailPath = `/internships/${course.slug}`;
  const applyPath = `/apply/${course.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="glass-card p-6 group hover:shadow-premium transition-shadow duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-lg mb-4">
        {course.title.charAt(0)}
      </div>
      <Link to={detailPath}>
        <h3 className="font-display font-bold text-xl text-brand-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
          {course.title}
        </h3>
      </Link>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {course.skills?.slice(0, 3).map((skill) => (
          <span key={skill} className="text-xs px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-800/50 text-brand-700 dark:text-brand-300">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
        <span className="flex items-center gap-1"><Wifi className="w-4 h-4" />{course.mode}</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <span className="flex items-center text-2xl font-bold text-brand-700 dark:text-brand-400">
          <IndianRupee className="w-5 h-5" />{course.price?.toLocaleString()}
        </span>
        <Link to={applyPath} className="btn-primary text-sm py-2 px-4">
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseCard;
