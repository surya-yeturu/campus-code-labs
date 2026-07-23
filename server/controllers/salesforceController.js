import SalesforceCandidate from '../models/SalesforceCandidate.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const STATUS_VALUES = ['New', 'Contacted', 'Interested', 'Enrolled', 'Not Interested', 'Closed'];

const buildFilter = (query) => {
  const { status, passingYear, branch, preferredBatch, experience, search } = query;
  const filter = {};
  if (status) filter.status = status;
  if (passingYear) filter.passingYear = passingYear;
  if (branch) filter.branch = branch;
  if (preferredBatch) filter.preferredBatch = preferredBatch;
  if (experience) filter.experience = experience;
  if (search) {
    const safe = escapeRegex(search);
    filter.$or = [
      { fullName: { $regex: safe, $options: 'i' } },
      { phone: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
      { college: { $regex: safe, $options: 'i' } },
    ];
  }
  return filter;
};

const getStats = async (filter = {}) => {
  const [total, newLeads, contacted, interested, enrolled] = await Promise.all([
    SalesforceCandidate.countDocuments(filter),
    SalesforceCandidate.countDocuments({ ...filter, status: 'New' }),
    SalesforceCandidate.countDocuments({ ...filter, status: 'Contacted' }),
    SalesforceCandidate.countDocuments({ ...filter, status: 'Interested' }),
    SalesforceCandidate.countDocuments({ ...filter, status: 'Enrolled' }),
  ]);
  const conversionRate = total > 0 ? Math.round((enrolled / total) * 100) : 0;
  return { total, newLeads, contacted, interested, enrolled, conversionRate };
};

export const submitApplication = async (req, res) => {
  const {
    fullName,
    phone,
    email,
    college,
    branch,
    passingYear,
    location,
    currentStatus,
    experience,
    interestedRole,
    preferredBatch,
    reason,
    agreed,
  } = req.body;

  if (agreed !== true && agreed !== 'true') {
    return res.status(400).json({ success: false, message: 'You must agree to be contacted' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = String(phone).trim();

  const existing = await SalesforceCandidate.findOne({
    email: normalizedEmail,
    phone: normalizedPhone,
  });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An application with this email and phone already exists',
    });
  }

  let resumePath = '';
  if (req.file) {
    resumePath = `/uploads/resumes/${req.file.filename}`;
  }

  const candidate = await SalesforceCandidate.create({
    fullName: String(fullName).trim(),
    phone: normalizedPhone,
    email: normalizedEmail,
    college: String(college).trim(),
    branch: String(branch).trim(),
    passingYear: String(passingYear).trim(),
    location: String(location).trim(),
    currentStatus,
    experience,
    interestedRole,
    preferredBatch,
    reason: String(reason).trim(),
    resume: resumePath,
    agreed: true,
    status: 'New',
    notes: '',
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: candidate,
  });
};

export const getAllCandidates = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const filter = buildFilter(req.query);
  const skip = (Number(page) - 1) * Number(limit);

  const [candidates, total, stats] = await Promise.all([
    SalesforceCandidate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    SalesforceCandidate.countDocuments(filter),
    getStats(filter),
  ]);

  res.json({
    success: true,
    data: candidates,
    stats,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getCandidateById = async (req, res) => {
  const candidate = await SalesforceCandidate.findById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }
  res.json({ success: true, data: candidate });
};

export const updateCandidate = async (req, res) => {
  const candidate = await SalesforceCandidate.findById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }

  const { status, notes } = req.body;
  if (status !== undefined) {
    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    candidate.status = status;
  }
  if (notes !== undefined) {
    candidate.notes = String(notes).trim();
  }

  await candidate.save();
  res.json({ success: true, data: candidate });
};

export const deleteCandidate = async (req, res) => {
  const candidate = await SalesforceCandidate.findByIdAndDelete(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }
  res.json({ success: true, message: 'Candidate deleted' });
};
