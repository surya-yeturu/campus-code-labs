import Payment from '../models/Payment.js';
import Application from '../models/Application.js';
import { createPaymentForApplication, processApplicationApproval } from '../services/enrollmentService.js';

export const submitManualPayment = async (req, res) => {
  const { applicationId, email, utrNumber } = req.body;

  if (!applicationId || !email || !utrNumber) {
    return res.status(400).json({ success: false, message: 'Application ID, email, and UTR number are required' });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
  }

  const application = await Application.findOne({ applicationId, email: email.toLowerCase() });
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  if (application.status === 'approved') {
    return res.status(400).json({ success: false, message: 'Application already approved' });
  }
  if (application.status === 'rejected') {
    return res.status(400).json({ success: false, message: 'Application was rejected' });
  }

  const screenshotUrl = `/uploads/payments/${req.file.filename}`;
  const payment = await createPaymentForApplication(application, { utrNumber, screenshotUrl });

  res.json({
    success: true,
    message: 'Payment submitted for verification',
    data: { application, payment },
  });
};

export const verifyManualPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('application');
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  if (payment.status === 'verified') {
    return res.status(400).json({ success: false, message: 'Payment already verified' });
  }
  if (payment.status !== 'submitted') {
    return res.status(400).json({ success: false, message: 'Payment not ready for verification' });
  }

  const application = payment.application || await Application.findOne({ payment: payment._id });
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  const result = await processApplicationApproval(application, req.user);

  res.json({
    success: true,
    message: 'Payment verified — certificate and offer letter emailed',
    data: result,
  });
};

export const rejectManualPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

  payment.status = 'rejected';
  await payment.save();

  const application = await Application.findOne({ payment: payment._id });
  if (application) {
    application.status = 'rejected';
    await application.save();
  }

  res.json({ success: true, message: 'Payment rejected', data: payment });
};

export const getPaymentByApplication = async (req, res) => {
  const { applicationId, email } = req.query;
  if (!applicationId || !email) {
    return res.status(400).json({ success: false, message: 'Application ID and email required' });
  }
  const application = await Application.findOne({ applicationId, email: email.toLowerCase() })
    .populate('course', 'title price')
    .populate('payment');
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
  res.json({ success: true, data: application });
};

export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate('course', 'title slug')
    .populate('application', 'applicationId status')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: payments });
};

export const getAllPayments = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;
  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('user', 'fullName email')
      .populate('course', 'title')
      .populate('application', 'applicationId fullName email status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: payments,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
};
