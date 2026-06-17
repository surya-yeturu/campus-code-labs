import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    email: { type: String, trim: true, lowercase: true },
    collegeName: { type: String, trim: true },
    branch: { type: String, trim: true },
    year: { type: String },
    internshipFromDate: { type: Date },
    internshipToDate: { type: Date },
    projectTitle: { type: String, trim: true, default: '' },
    certificateNo: { type: String, trim: true, required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    duration: { type: String, required: true },
    completionDate: { type: Date, required: true },
    certificateUrl: { type: String, default: '' },
    qrCodeUrl: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
