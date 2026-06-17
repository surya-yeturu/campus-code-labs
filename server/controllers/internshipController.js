import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import { generateInternshipId } from '../utils/generateId.js';

export const createInternship = async (req, res) => {
  const { courseId, duration, startDate, endDate, profilePhoto, applicationDetails } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

  const internship = await Internship.create({
    internshipId: generateInternshipId(),
    user: req.user._id,
    course: courseId,
    duration,
    startDate,
    endDate,
    profilePhoto: profilePhoto || req.user.profilePhoto,
    applicationDetails,
    status: 'pending_payment',
  });

  const populated = await Internship.findById(internship._id).populate('course', 'title price slug');
  res.status(201).json({ success: true, data: populated });
};

export const getMyInternships = async (req, res) => {
  const internships = await Internship.find({ user: req.user._id })
    .populate('course', 'title slug price duration')
    .populate('certificate')
    .populate('payment')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: internships.length, data: internships });
};

export const getInternship = async (req, res) => {
  const internship = await Internship.findById(req.params.id)
    .populate('course')
    .populate('user', 'fullName email collegeName')
    .populate('certificate')
    .populate('payment');
  if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
  if (req.user.role !== 'admin' && internship.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  res.json({ success: true, data: internship });
};

export const getAllInternships = async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { internshipId: { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (page - 1) * limit;
  const [internships, total] = await Promise.all([
    Internship.find(filter)
      .populate('user', 'fullName email collegeName')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Internship.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: internships,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
};

export const updateInternshipStatus = async (req, res) => {
  const internship = await Internship.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
  res.json({ success: true, data: internship });
};
