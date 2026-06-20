import mongoose from 'mongoose';
import { loadEnv } from '../config/env.js';
import connectDB from '../config/db.js';
import startupSeed from '../services/startupSeed.js';

loadEnv();

const seed = async () => {
  try {
    await connectDB();
    await startupSeed();
    console.log('Seed completed successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seed();
