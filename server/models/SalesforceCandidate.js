import mongoose from 'mongoose';

const salesforceCandidateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    college: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    passingYear: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    currentStatus: {
      type: String,
      enum: ['Student', 'Graduate', 'Working Professional'],
      required: true,
    },
    experience: {
      type: String,
      enum: ['Fresher', '0-1 Years', '1-2 Years', '2+ Years'],
      required: true,
    },
    interestedRole: {
      type: String,
      enum: ['Salesforce Developer', 'Salesforce Administrator', 'Both'],
      required: true,
    },
    preferredBatch: {
      type: String,
      enum: ['Morning', 'Evening', 'Weekend'],
      required: true,
    },
    reason: { type: String, required: true, trim: true },
    resume: { type: String, default: '' },
    agreed: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Enrolled', 'Not Interested', 'Closed'],
      default: 'New',
    },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true, collection: 'salesforce_candidates' }
);

salesforceCandidateSchema.index({ email: 1, phone: 1 }, { unique: true });

const SalesforceCandidate = mongoose.model('SalesforceCandidate', salesforceCandidateSchema);
export default SalesforceCandidate;
