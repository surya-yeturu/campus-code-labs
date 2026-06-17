import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    internshipId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    studentFullName: { type: String, trim: true },
    studentEmail: { type: String, trim: true, lowercase: true },
    collegeName: { type: String, trim: true },
    branch: { type: String, trim: true },
    year: { type: String },
    projectTitle: { type: String, trim: true, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    profilePhoto: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending_payment', 'active', 'completed', 'cancelled'],
      default: 'pending_payment',
    },
    offerLetterUrl: { type: String, default: '' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    applicationDetails: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      linkedin: String,
      github: String,
    },
  },
  { timestamps: true }
);

const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
