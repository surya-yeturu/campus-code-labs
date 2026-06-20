import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Certificate from '../models/Certificate.js';
import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import Review from '../models/Review.js';
import Application from '../models/Application.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const VERIFIED_PAYMENT_STATUSES = ['paid', 'verified'];

export const getDashboardStats = async (req, res) => {
  const paymentMatch = { status: { $in: VERIFIED_PAYMENT_STATUSES } };

  const [
    totalApplicants,
    totalApplications,
    totalRevenue,
    totalCertificates,
    activeInternships,
    pendingApprovals,
    totalCourses,
    recentPayments,
    monthlyRevenue,
  ] = await Promise.all([
    Application.distinct('email').then((emails) => emails.length),
    Application.countDocuments(),
    Payment.aggregate([
      { $match: paymentMatch },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Certificate.countDocuments(),
    Internship.countDocuments({ status: 'active' }),
    Application.countDocuments({ status: 'payment_submitted' }),
    Course.countDocuments({ isActive: true }),
    Payment.find(paymentMatch)
      .populate('user', 'fullName')
      .populate('application', 'fullName email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(5),
    Payment.aggregate([
      { $match: paymentMatch },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const statusBreakdown = await Internship.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: {
      totalApplicants,
      totalApplications,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCertificates,
      activeInternships,
      pendingApprovals,
      totalCourses,
      recentPayments,
      monthlyRevenue,
      statusBreakdown,
    },
  });
};

export const getStudents = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const safe = search ? escapeRegex(search) : '';
  const userFilter = { role: 'student' };
  const applicationFilter = {};

  if (search) {
    userFilter.$or = [
      { fullName: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
      { collegeName: { $regex: safe, $options: 'i' } },
      { phone: { $regex: safe, $options: 'i' } },
    ];
    applicationFilter.$or = [
      { fullName: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
      { collegeName: { $regex: safe, $options: 'i' } },
      { phone: { $regex: safe, $options: 'i' } },
      { applicationId: { $regex: safe, $options: 'i' } },
    ];
  }

  const [users, applications] = await Promise.all([
    User.find(userFilter).select('-password').lean(),
    Application.find(applicationFilter)
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const byEmail = new Map();
  const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

  for (const application of applications) {
    const email = normalizeEmail(application.email);
    if (!email) continue;

    const existing = byEmail.get(email);
    if (!existing) {
      byEmail.set(email, {
        _id: application.user || application._id,
        userId: application.user || null,
        source: application.user ? 'user' : 'application',
        fullName: application.fullName,
        email,
        phone: application.phone,
        collegeName: application.collegeName,
        branch: application.branch,
        year: application.year,
        isActive: true,
        applicationCount: 1,
        latestApplicationId: application.applicationId,
        latestApplicationStatus: application.status,
        latestCourse: application.course?.title || '',
        latestActivityAt: application.createdAt,
        createdAt: application.createdAt,
      });
      continue;
    }

    existing.applicationCount += 1;
  }

  for (const user of users) {
    const email = normalizeEmail(user.email);
    if (!email) continue;

    const existing = byEmail.get(email);
    if (existing) {
      byEmail.set(email, {
        ...existing,
        _id: user._id,
        userId: user._id,
        source: 'user',
        fullName: user.fullName || existing.fullName,
        phone: user.phone || existing.phone,
        collegeName: user.collegeName || existing.collegeName,
        branch: user.branch || existing.branch,
        year: user.year || existing.year,
        isActive: user.isActive,
        createdAt: user.createdAt || existing.createdAt,
      });
      continue;
    }

    byEmail.set(email, {
      ...user,
      userId: user._id,
      source: 'user',
      applicationCount: 0,
      latestApplicationId: '',
      latestApplicationStatus: '',
      latestCourse: '',
      latestActivityAt: user.createdAt,
    });
  }

  const allStudents = Array.from(byEmail.values()).sort((a, b) =>
    new Date(b.latestActivityAt || b.createdAt) - new Date(a.latestActivityAt || a.createdAt)
  );
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;
  const students = allStudents.slice(skip, skip + pageSize);
  const total = allStudents.length;

  res.json({
    success: true,
    data: students,
    pagination: { page: pageNumber, limit: pageSize, total, pages: Math.max(1, Math.ceil(total / pageSize)) },
  });
};

export const getReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find()
      .populate('user', 'fullName email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(),
  ]);
  res.json({
    success: true,
    data: reviews,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
};

export const toggleStudentStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'student') {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
};
