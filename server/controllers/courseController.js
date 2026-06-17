import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { isActive: true };
  const courses = await Course.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: courses.length, data: courses });
};

export const getCourse = async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, data: course });
};

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
};

export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, data: course });
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, message: 'Course deactivated' });
};
