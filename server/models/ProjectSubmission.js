import mongoose from 'mongoose';

const projectSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

projectSubmissionSchema.index({ user: 1, project: 1 }, { unique: true });

const ProjectSubmission = mongoose.model('ProjectSubmission', projectSubmissionSchema);
export default ProjectSubmission;
