import Application from '../models/Application.js';
import Course from '../models/Course.js';
import { generateApplicationId } from '../utils/generateId.js';
import { sendApplicationReceivedEmail } from '../services/emailService.js';
import { processApplicationApproval } from '../services/enrollmentService.js';

export const submitApplication = async (req, res) => {
  const { fullName, email, phone, collegeName, branch, year, courseId, duration } = req.body;

  if (!fullName || !email || !phone || !collegeName || !branch || !year || !courseId || !duration) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided' });
  }

  const course = await Course.findById(courseId);
  if (!course || !course.isActive) {
    return res.status(404).json({ success: false, message: 'Internship program not found' });
  }

  const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : '';

  const application = await Application.create({
    applicationId: generateApplicationId(),
    fullName,
    email,
    phone,
    collegeName,
    branch,
    year,
    course: courseId,
    duration,
    resumeUrl,
    status: 'pending',
  });

  sendApplicationReceivedEmail({ fullName, email, applicationId: application.applicationId }, course.title).catch(console.error);

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
  if (email && application.email !== email.toLowerCase()) {
    return res.status(403).json({ success: false, message: 'Email does not match application' });
  }
  res.json({ success: true, data: application });
};

export const getAllApplications = async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { applicationId: { $regex: search, $options: 'i' } },
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
