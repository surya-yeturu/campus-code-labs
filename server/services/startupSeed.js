import User from '../models/User.js';
import Course from '../models/Course.js';
import { defaultCourses } from '../utils/defaultCourses.js';

const getAdminSeedData = () => ({
  fullName: process.env.ADMIN_NAME || 'Admin',
  email: (process.env.ADMIN_EMAIL || 'admin@learnovate.com').trim().toLowerCase(),
  phone: process.env.ADMIN_PHONE || '9999999999',
  collegeName: process.env.ADMIN_COLLEGE || 'Campus Code Labs HQ',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role: 'admin',
  isActive: true,
});

export const startupSeed = async () => {
  console.log('Checking seed data...');

  const courseCount = await Course.estimatedDocumentCount();
  if (courseCount > 0) {
    console.log('Courses already exist, skipping');
  } else {
    console.log('Seeding courses...');
    await Promise.all(
      defaultCourses.map((course) =>
        Course.findOneAndUpdate(
          { slug: course.slug },
          { $setOnInsert: course },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );
  }

  const adminSeed = getAdminSeedData();
  const adminExists = await User.exists({
    $or: [{ role: 'admin' }, { email: adminSeed.email }],
  });

  if (adminExists) {
    console.log('Admin already exists, skipping');
  } else {
    console.log('Creating admin...');
    await User.create(adminSeed);
  }

  console.log('Startup seeding completed');
};

export default startupSeed;
