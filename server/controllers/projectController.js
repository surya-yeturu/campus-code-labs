import Project from '../models/Project.js';
import ProjectSubmission from '../models/ProjectSubmission.js';
import Internship from '../models/Internship.js';

export const createProject = async (req, res) => {
  const { title, description, level, courseId } = req.body;
  const project = await Project.create({ title, description, level, course: courseId });
  res.status(201).json({ success: true, data: project });
};

export const getAllProjects = async (req, res) => {
  const projects = await Project.find().populate('course', 'title slug').sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('course', 'title');
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
};

export const getMyProjects = async (req, res) => {
  const internships = await Internship.find({ user: req.user._id, status: { $in: ['active', 'completed'] } });
  const courseIds = [...new Set(internships.map((i) => i.course.toString()))];
  const projects = await Project.find({ course: { $in: courseIds }, isActive: true })
    .populate('course', 'title slug')
    .sort({ createdAt: -1 });
  const submissions = await ProjectSubmission.find({ user: req.user._id });
  const submissionMap = Object.fromEntries(submissions.map((s) => [s.project.toString(), s]));
  const data = projects.map((p) => ({
    ...p.toObject(),
    submission: submissionMap[p._id.toString()] || null,
  }));
  res.json({ success: true, data });
};

export const submitProject = async (req, res) => {
  const { githubUrl, liveUrl, description } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const internship = await Internship.findOne({
    user: req.user._id,
    course: project.course,
    status: { $in: ['active', 'completed'] },
  });
  if (!internship) {
    return res.status(403).json({ success: false, message: 'No active enrollment for this project' });
  }

  const submission = await ProjectSubmission.findOneAndUpdate(
    { user: req.user._id, project: project._id },
    { githubUrl, liveUrl, description, internship: internship._id },
    { new: true, upsert: true }
  );
  res.json({ success: true, data: submission });
};
