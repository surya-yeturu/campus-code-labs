import mongoose from 'mongoose';

const recommendationLetterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    fileUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issuedAt: { type: Date },
  },
  { timestamps: true }
);

const RecommendationLetter = mongoose.model('RecommendationLetter', recommendationLetterSchema);
export default RecommendationLetter;
