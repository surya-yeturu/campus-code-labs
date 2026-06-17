import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    skills: [{ type: String }],
    mode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
