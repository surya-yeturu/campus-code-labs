import Application from '../models/Application.js';
import Course from '../models/Course.js';
import { generateApplicationId } from '../utils/generateId.js';
import { escapeRegex, parseDateOnly } from '../utils/escapeRegex.js';
import { processApplicationApproval } from '../services/enrollmentService.js';
import { isSupportedDuration } from '../utils/internshipPricing.js';

export const submitApplication = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    collegeName,
    branch,
    year,
    courseId,
    duration,
    internshipFromDate,
    internshipToDate,
    projectTitle,
    certificateDate,
  } = req.body;

  const parsedFromDate = parseDateOnly(internshipFromDate);
  const parsedToDate = parseDateOnly(internshipToDate);
  if (!parsedFromDate || !parsedToDate) {
    return res.status(400).json({ success: false, message: 'Invalid internship dates' });
  }
  if (parsedToDate < parsedFromDate) {
    return res.status(400).json({ success: false, message: 'To date must be on or after from date' });
  }
  if (!isSupportedDuration(duration)) {
    return res.status(400).json({ success: false, message: 'Duration must be 4 Weeks, 8 Weeks, or 12 Weeks' });
  }

  let parsedCertDate = null;
  if (certificateDate) {
    parsedCertDate = parseDateOnly(certificateDate);
    if (!parsedCertDate) {
      return res.status(400).json({ success: false, message: 'Invalid certificate date' });
    }
  }

  const course = await Course.findById(courseId);
  if (!course || !course.isActive) {
    return res.status(404).json({ success: false, message: 'Internship program not found' });
  }

  const application = await Application.create({
    applicationId: generateApplicationId(),
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    collegeName: String(collegeName).trim(),
    branch: String(branch).trim(),
    year: String(year).trim(),
    internshipFromDate: parsedFromDate,
    internshipToDate: parsedToDate,
    projectTitle: projectTitle ? String(projectTitle).trim() : '',
    ...(parsedCertDate ? { certificateDate: parsedCertDate } : {}),
    course: courseId,
    duration: String(duration).trim(),
    resumeUrl: '',
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application,
  });
};

export const getApplicationStatus = async (req, res) => {
  const { email } = req.query;
  const application = await Application.findOne({ applicationId: req.params.applicationId })
    .populate('course', 'title slug price')
    .populate('payment');
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
  if (email && application.email !== String(email).trim().toLowerCase()) {
    return res.status(403).json({ success: false, message: 'Email does not match application' });
  }
  res.json({ success: true, data: application });
};

export const getAllApplications = async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const safe = escapeRegex(search);
    filter.$or = [
      { fullName: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
      { applicationId: { $regex: safe, $options: 'i' } },
    ];
  }
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate('course', 'title slug price')
      .populate('payment')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Application.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: applications,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
};

export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('payment');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Application already approved' });
    }
    if (application.status !== 'payment_submitted') {
      return res.status(400).json({ success: false, message: 'Payment must be submitted before approval' });
    }

    const result = await processApplicationApproval(application, req.user);
    res.json({ success: true, message: 'Application approved', data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Approval failed',
    });
  }
};

export const rejectApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  application.status = 'rejected';
  await application.save();

  if (application.payment) {
    const Payment = (await import('../models/Payment.js')).default;
    await Payment.findByIdAndUpdate(application.payment, { status: 'rejected' });
  }

  res.json({ success: true, data: application });
};
