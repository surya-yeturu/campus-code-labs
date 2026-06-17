import crypto from 'crypto';
import Application from '../models/Application.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import { generateInternshipId, generateReceipt } from '../utils/generateId.js';
import { generateOfferLetterPDF } from '../services/pdfService.js';
import { uploadBuffer } from '../services/storageService.js';
import {
  sendPaymentApprovedEmail,
  sendOfferLetterEmail,
  sendWelcomeCredentialsEmail,
} from '../services/emailService.js';

const parseDurationWeeks = (duration) => {
  const match = String(duration).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 8;
};

const generateTempPassword = () => crypto.randomBytes(4).toString('hex');

export const processApplicationApproval = async (application, adminUser) => {
  const course = await Course.findById(application.course);
  if (!course) throw new Error('Course not found');

  const paymentId = application.payment?._id || application.payment;
  const payment = paymentId ? await Payment.findById(paymentId) : null;
  if (!payment) throw new Error('Payment record not found');
  if (payment.status !== 'submitted') throw new Error('Payment must be submitted before approval');

  let user = await User.findOne({ email: application.email });
  let tempPassword = null;

  if (!user) {
    tempPassword = generateTempPassword();
    user = await User.create({
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      collegeName: application.collegeName,
      branch: application.branch,
      year: application.year,
      password: tempPassword,
    });
  } else {
    user.fullName = application.fullName;
    user.phone = application.phone;
    user.collegeName = application.collegeName;
    user.branch = application.branch;
    user.year = application.year;
    await user.save();
  }

  const weeks = parseDurationWeeks(application.duration);
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + weeks * 7);

  const internship = await Internship.create({
    internshipId: generateInternshipId(),
    user: user._id,
    course: course._id,
    duration: application.duration,
    startDate,
    endDate,
    status: 'active',
  });

  const pdfBuffer = await generateOfferLetterPDF({
    studentName: user.fullName,
    collegeName: user.collegeName,
    courseName: course.title,
    duration: application.duration,
    startDate,
    endDate,
    internshipId: internship.internshipId,
  });

  let offerLetterUrl = '';
  try {
    const upload = await uploadBuffer(pdfBuffer, 'offer-letters', internship.internshipId);
    offerLetterUrl = upload.secure_url;
  } catch (err) {
    console.error('Offer letter upload failed:', err.message);
    offerLetterUrl = `${process.env.CLIENT_URL}/dashboard/offer-letter`;
  }

  internship.offerLetterUrl = offerLetterUrl;
  internship.payment = payment._id;
  await internship.save();

  payment.user = user._id;
  payment.internship = internship._id;
  payment.status = 'verified';
  payment.verifiedBy = adminUser._id;
  payment.verifiedAt = new Date();
  await payment.save();

  application.user = user._id;
  application.internship = internship._id;
  application.status = 'approved';
  await application.save();

  await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

  await Promise.allSettled([
    sendPaymentApprovedEmail(user, course, payment),
    sendOfferLetterEmail(user, internship, offerLetterUrl),
    tempPassword ? sendWelcomeCredentialsEmail(user, tempPassword) : Promise.resolve(),
  ]);

  return { user, internship, payment, application, tempPassword };
};

export const createPaymentForApplication = async (application, { utrNumber, screenshotUrl }) => {
  const course = await Course.findById(application.course);
  if (!course) throw new Error('Course not found');

  const existingPaymentId = application.payment?._id || application.payment;
  let payment = existingPaymentId ? await Payment.findById(existingPaymentId) : null;

  if (payment && payment.status === 'verified') {
    throw new Error('Payment already verified');
  }

  if (!payment) {
    payment = await Payment.create({
      application: application._id,
      course: course._id,
      amount: course.price,
      utrNumber,
      screenshotUrl,
      status: 'submitted',
      receipt: generateReceipt(),
    });
    application.payment = payment._id;
  } else {
    payment.utrNumber = utrNumber;
    payment.screenshotUrl = screenshotUrl;
    payment.status = 'submitted';
    await payment.save();
  }

  application.status = 'payment_submitted';
  await application.save();

  return payment;
};
