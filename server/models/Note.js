import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;
