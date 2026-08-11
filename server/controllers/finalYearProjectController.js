import FinalYearProject from '../models/FinalYearProject.js';

export const getPublicFinalYearProjects = async (req, res) => {
  const projects = await FinalYearProject.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
};

export const getAllFinalYearProjects = async (req, res) => {
  const projects = await FinalYearProject.find().sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
};

export const createFinalYearProject = async (req, res) => {
  const { title, description, about, isActive } = req.body;
  const project = await FinalYearProject.create({ title, description, about, isActive });
  res.status(201).json({ success: true, data: project });
};

export const updateFinalYearProject = async (req, res) => {
  const project = await FinalYearProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

export const deleteFinalYearProject = async (req, res) => {
  const project = await FinalYearProject.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
};
