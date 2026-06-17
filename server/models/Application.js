import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    duration: { type: String, required: true },
    resumeUrl: { type: String, default: '' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
    status: {
      type: String,
      enum: ['pending', 'payment_submitted', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
