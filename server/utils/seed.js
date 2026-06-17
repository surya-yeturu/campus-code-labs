import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';

dotenv.config();

const courses = [
  {
    title: 'Python Full Stack Internship',
    slug: 'python-full-stack',
    description: 'Master Python, Django, REST APIs, and full-stack development with real-world projects.',
    duration: '8 Weeks',
    price: 2999,
    skills: ['Python', 'Django', 'REST API', 'PostgreSQL', 'Git'],
    mode: 'Remote',
  },
  {
    title: 'MERN Stack Internship',
    slug: 'mern-stack',
    description: 'Build modern web applications with MongoDB, Express, React, and Node.js.',
    duration: '8 Weeks',
    price: 3499,
    skills: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    mode: 'Remote',
  },
  {
    title: 'Java Full Stack Internship',
    slug: 'java-full-stack',
    description: 'Enterprise-grade Java development with Spring Boot and microservices.',
    duration: '10 Weeks',
    price: 3999,
    skills: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'Microservices'],
    mode: 'Remote',
  },
  {
    title: 'Data Science Internship',
    slug: 'data-science',
    description: 'Learn data analysis, visualization, and machine learning fundamentals.',
    duration: '8 Weeks',
    price: 4499,
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
    mode: 'Remote',
  },
  {
    title: 'AI & Machine Learning Internship',
    slug: 'ai-machine-learning',
    description: 'Deep dive into neural networks, NLP, and AI model deployment.',
    duration: '10 Weeks',
    price: 4999,
    skills: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
    mode: 'Remote',
  },
  {
    title: 'Cyber Security Internship',
    slug: 'cyber-security',
    description: 'Ethical hacking, network security, and vulnerability assessment.',
    duration: '8 Weeks',
    price: 3999,
    skills: ['Ethical Hacking', 'Network Security', 'Penetration Testing', 'SIEM'],
    mode: 'Remote',
  },
  {
    title: 'UI/UX Design Internship',
    slug: 'ui-ux-design',
    description: 'Design beautiful, user-centered digital experiences with industry tools.',
    duration: '6 Weeks',
    price: 2499,
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    mode: 'Remote',
  },
  {
    title: 'Web Development Internship',
    slug: 'web-development',
    description: 'Frontend fundamentals with HTML, CSS, JavaScript, and modern frameworks.',
    duration: '6 Weeks',
    price: 1999,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'],
    mode: 'Remote',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('Courses seeded');

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@learnovate.com' });
    if (!adminExists) {
      await User.create({
        fullName: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@learnovate.com',
        phone: '9999999999',
        collegeName: 'Learnovate HQ',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
      });
      console.log('Admin user created');
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
