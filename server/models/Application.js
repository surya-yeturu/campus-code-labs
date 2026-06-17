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
    internshipFromDate: { type: Date, required: true },
    internshipToDate: { type: Date, required: true },
    projectTitle: { type: String, trim: true, default: '' },
    // Optional: explicit certificate date chosen by admin/student; if missing, we use current date
    certificateDate: { type: Date },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    duration: { type: String, required: true },
    resumeUrl: { type: String, default: '' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
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
