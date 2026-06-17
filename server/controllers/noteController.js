import Note from '../models/Note.js';
import Internship from '../models/Internship.js';

export const createNote = async (req, res) => {
  const { title, courseId, linkUrl } = req.body;
  const fileUrl = req.file ? `/uploads/notes/${req.file.filename}` : '';
  if (!fileUrl && !linkUrl) {
    return res.status(400).json({ success: false, message: 'Upload a file or provide a link' });
  }
  const note = await Note.create({ title, course: courseId, fileUrl, linkUrl: linkUrl || '' });
  res.status(201).json({ success: true, data: note });
};

export const getAllNotes = async (req, res) => {
  const notes = await Note.find().populate('course', 'title slug').sort({ createdAt: -1 });
  res.json({ success: true, data: notes });
};

export const updateNote = async (req, res) => {
  const { title, linkUrl, isActive } = req.body;
  const update = {};
  if (title) update.title = title;
  if (linkUrl !== undefined) update.linkUrl = linkUrl;
  if (isActive !== undefined) update.isActive = isActive;
  if (req.file) update.fileUrl = `/uploads/notes/${req.file.filename}`;
  const note = await Note.findByIdAndUpdate(req.params.id, update, { new: true }).populate('course', 'title');
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  res.json({ success: true, data: note });
};

export const deleteNote = async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  res.json({ success: true, message: 'Note deleted' });
};

export const getMyNotes = async (req, res) => {
  const internships = await Internship.find({ user: req.user._id, status: { $in: ['active', 'completed'] } });
  const courseIds = [...new Set(internships.map((i) => i.course.toString()))];
  const notes = await Note.find({ course: { $in: courseIds }, isActive: true })
    .populate('course', 'title slug')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: notes });
};
