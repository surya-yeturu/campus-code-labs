import mongoose from 'mongoose';

const finalYearProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    about: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FinalYearProject = mongoose.model('FinalYearProject', finalYearProjectSchema);
export default FinalYearProject;
