import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
