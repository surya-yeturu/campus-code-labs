import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Certificate from '../models/Certificate.js';
import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import Review from '../models/Review.js';

const VERIFIED_PAYMENT_STATUSES = ['paid', 'verified'];

export const getDashboardStats = async (req, res) => {
  const paymentMatch = { status: { $in: VERIFIED_PAYMENT_STATUSES } };

  const [
    totalStudents,
    totalRevenue,
    totalCertificates,
    activeInternships,
    totalCourses,
    recentPayments,
    monthlyRevenue,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Payment.aggregate([
      { $match: paymentMatch },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Certificate.countDocuments(),
    Internship.countDocuments({ status: 'active' }),
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
      totalStudents,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCertificates,
      activeInternships,
      totalCourses,
      recentPayments,
      monthlyRevenue,
      statusBreakdown,
    },
  });
};

export const getStudents = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const filter = { role: 'student' };
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { collegeName: { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (page - 1) * limit;
  const [students, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: students,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
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
