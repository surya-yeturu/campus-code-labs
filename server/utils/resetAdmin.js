import mongoose from 'mongoose';
import { loadEnv } from '../config/env.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';

loadEnv();

const resetAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || '';

    if (!email) {
      throw new Error('ADMIN_EMAIL is required in server/.env or server/services/.env');
    }

    if (password.length < 6) {
      throw new Error('ADMIN_PASSWORD must be at least 6 characters');
    }

    await connectDB();

    let admin = await User.findOne({ role: 'admin' }).select('+password');
    const existingWithEmail = await User.findOne({ email }).select('+password');

    if (existingWithEmail && admin && existingWithEmail._id.toString() !== admin._id.toString()) {
      throw new Error(`Cannot use ${email}; another user already has this email`);
    }

    if (!admin) {
      admin = existingWithEmail;
    }

    if (!admin) {
      admin = new User({
        fullName: process.env.ADMIN_NAME || 'Admin',
        email,
        phone: process.env.ADMIN_PHONE || '9999999999',
        collegeName: process.env.ADMIN_COLLEGE || 'Campus Code Labs HQ',
        role: 'admin',
        isActive: true,
      });
    }

    admin.fullName = process.env.ADMIN_NAME || admin.fullName || 'Admin';
    admin.email = email;
    admin.phone = process.env.ADMIN_PHONE || admin.phone || '9999999999';
    admin.collegeName = process.env.ADMIN_COLLEGE || admin.collegeName || 'Campus Code Labs HQ';
    admin.role = 'admin';
    admin.isActive = true;
    admin.password = password;

    await admin.save();

    console.log(`Admin reset successfully: ${admin.email}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Admin reset failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

resetAdmin();
