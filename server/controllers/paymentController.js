import Payment from '../models/Payment.js';
import Application from '../models/Application.js';
import { createPaymentForApplication, processApplicationApproval } from '../services/enrollmentService.js';
import { createOrder, verifyPaymentSignature } from '../services/razorpayService.js';
import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { generateReceipt } from '../utils/generateId.js';
import { generateOfferLetterPDF } from '../services/pdfService.js';
import { uploadBuffer } from '../services/cloudinaryService.js';
import { sendPaymentSuccessEmail, sendOfferLetterEmail } from '../services/emailService.js';

const processOfferLetter = async (internship, user, course) => {
  const pdfBuffer = await generateOfferLetterPDF({
    studentName: user.fullName,
    collegeName: user.collegeName,
    courseName: course.title,
    duration: internship.duration,
    startDate: internship.startDate,
    endDate: internship.endDate,
    internshipId: internship.internshipId,
  });

  let offerLetterUrl = '';
  try {
    const upload = await uploadBuffer(pdfBuffer, 'offer-letters', internship.internshipId);
    offerLetterUrl = upload.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed, using local reference:', err.message);
    offerLetterUrl = `${process.env.CLIENT_URL}/dashboard/offer-letter`;
  }

  internship.offerLetterUrl = offerLetterUrl;
  internship.status = 'active';
  await internship.save();

  sendOfferLetterEmail(user, internship, offerLetterUrl).catch(console.error);
  return offerLetterUrl;
};

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

// Legacy Razorpay endpoints (kept for backward compatibility)
export const createPaymentOrder = async (req, res) => {
  const { internshipId } = req.body;
  const internship = await Internship.findById(internshipId).populate('course');
  if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
  if (internship.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  if (internship.status !== 'pending_payment') {
    return res.status(400).json({ success: false, message: 'Payment already processed' });
  }

  const course = internship.course;
  const receipt = generateReceipt();
  const order = await createOrder(course.price, receipt, {
    internshipId: internship._id.toString(),
    userId: req.user._id.toString(),
  });

  const payment = await Payment.create({
    user: req.user._id,
    internship: internship._id,
    course: course._id,
    amount: course.price,
    razorpayOrderId: order.id,
    receipt,
    status: 'created',
  });

  res.json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      receipt,
    },
  });
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = 'paid';
  await payment.save();

  const internship = await Internship.findById(payment.internship).populate('course');
  const user = await User.findById(payment.user);
  const course = await Course.findById(payment.course);

  internship.payment = payment._id;
  await internship.save();
  await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

  sendPaymentSuccessEmail(user, payment, course).catch(console.error);
  const offerLetterUrl = await processOfferLetter(internship, user, course);

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: { payment, internship, offerLetterUrl },
  });
};

export const razorpayWebhook = async (req, res) => {
  const event = req.body.event;
  if (event === 'payment.captured') {
    const paymentEntity = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
    if (payment && payment.status !== 'paid') {
      payment.razorpayPaymentId = paymentEntity.id;
      payment.status = 'paid';
      await payment.save();
    }
  }
  res.json({ success: true });
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
