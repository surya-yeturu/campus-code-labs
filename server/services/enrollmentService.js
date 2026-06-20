import Application from '../models/Application.js';
import Payment from '../models/Payment.js';
import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import { generateInternshipId, generateReceipt } from '../utils/generateId.js';
import { generateOfferLetterPDF } from '../services/pdfService.js';
import { uploadBuffer } from '../services/storageService.js';
import { issueCertificateForInternship } from '../services/certificateService.js';
import {
  sendOfferLetterEmail,
  sendPaymentApprovedEmail,
} from '../services/emailService.js';
import { getInternshipPrice, parseDurationWeeks } from '../utils/internshipPricing.js';

const badRequest = (message) => {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
};

const toAbsoluteUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${(process.env.CLIENT_URL || '').replace(/\/$/, '')}${value.startsWith('/') ? value : `/${value}`}`;
};

const sendApprovalEmails = async ({ applicant, internship, offerLetterUrl, pdfBuffer, payment, course, certificate }) => {
  const tasks = [
    sendOfferLetterEmail(applicant, internship, offerLetterUrl, {
      filename: `Internship-Offer-Letter-${internship.internshipId}.pdf`,
      content: pdfBuffer,
    }),
    sendPaymentApprovedEmail(applicant, course, payment, certificate),
  ];

  const results = await Promise.allSettled(tasks);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Approval email failed:', result.reason?.message || result.reason);
    }
  });
};

export const processApplicationApproval = async (application, adminUser, { sendEmails = true } = {}) => {
  const course = await Course.findById(application.course);
  if (!course) throw new Error('Course not found');

  const paymentId = application.payment?._id || application.payment;
  const payment = paymentId ? await Payment.findById(paymentId) : null;
  if (!payment) throw new Error('Payment record not found');
  if (!['submitted', 'verified'].includes(payment.status)) {
    throw badRequest('Payment must be submitted before approval');
  }

  if (payment.status === 'verified' && (application.internship || payment.internship)) {
    const internship = await Internship.findById(application.internship || payment.internship);
    if (internship) {
      application.internship = application.internship || internship._id;
      application.certificate = application.certificate || internship.certificate;
      application.status = 'approved';
      await application.save();
      return { internship, payment, application, certificate: application.certificate || internship.certificate };
    }
  }

  const applicant = {
    fullName: application.fullName,
    email: application.email,
    collegeName: application.collegeName,
    branch: application.branch,
    year: application.year,
    certificateDate: application.certificateDate,
    internshipFromDate: application.internshipFromDate,
    internshipToDate: application.internshipToDate,
    projectTitle: application.projectTitle || '',
  };

  const weeks = parseDurationWeeks(application.duration) || 8;
  const startDate = applicant.internshipFromDate ? new Date(applicant.internshipFromDate) : new Date();
  const endDate = applicant.internshipToDate ? new Date(applicant.internshipToDate) : new Date(startDate);
  if (!applicant.internshipToDate) {
    endDate.setDate(endDate.getDate() + weeks * 7);
  }

  const internship = await Internship.create({
    internshipId: generateInternshipId(),
    application: application._id,
    studentFullName: applicant.fullName,
    studentEmail: applicant.email,
    collegeName: applicant.collegeName,
    branch: applicant.branch,
    year: applicant.year,
    projectTitle: applicant.projectTitle,
    course: course._id,
    duration: application.duration,
    startDate,
    endDate,
    status: 'completed',
  });

  const pdfBuffer = await generateOfferLetterPDF({
    studentName: applicant.fullName,
    collegeName: applicant.collegeName,
    year: applicant.year,
    branch: applicant.branch,
    courseName: course.title,
    duration: application.duration,
    startDate,
    endDate,
    internshipId: internship.internshipId,
  });

  let offerLetterUrl = '';
  try {
    const upload = await uploadBuffer(
      pdfBuffer,
      'offer-letters',
      `${internship.internshipId}.pdf`,
      'application/pdf'
    );
    offerLetterUrl = toAbsoluteUrl(upload.secure_url || upload.url);
  } catch (err) {
    console.error('Offer letter upload failed:', err.message);
    offerLetterUrl = '';
  }

  internship.offerLetterUrl = offerLetterUrl;
  internship.payment = payment._id;
  await internship.save();

  payment.internship = internship._id;
  payment.status = 'verified';
  payment.verifiedBy = adminUser._id;
  payment.verifiedAt = new Date();
  await payment.save();

  const certificate = await issueCertificateForInternship(internship, applicant, { sendEmail: sendEmails });

  application.internship = internship._id;
  application.certificate = certificate._id;
  application.status = 'approved';
  await application.save();

  await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

  if (sendEmails) {
    sendApprovalEmails({ applicant, internship, offerLetterUrl, pdfBuffer, payment, course, certificate });
  }

  return { internship, payment, application, certificate };
};

export const createPaymentForApplication = async (application, { utrNumber, screenshotUrl }) => {
  const course = await Course.findById(application.course);
  if (!course) throw new Error('Course not found');
  const amount = getInternshipPrice(application.duration);
  if (!amount) {
    const err = new Error('Duration must be 4 Weeks, 8 Weeks, or 12 Weeks');
    err.statusCode = 400;
    throw err;
  }

  const normalizedUtr = String(utrNumber || '').trim();
  const existingPaymentId = application.payment?._id || application.payment;
  let payment = existingPaymentId ? await Payment.findById(existingPaymentId) : null;

  const duplicateUtr = await Payment.findOne({ utrNumber: normalizedUtr });
  if (duplicateUtr && duplicateUtr._id.toString() !== payment?._id?.toString()) {
    const err = new Error('UTR number already exists');
    err.statusCode = 400;
    throw err;
  }

  if (payment && payment.status === 'verified') {
    throw new Error('Payment already verified');
  }

  if (!payment) {
    payment = await Payment.create({
      application: application._id,
      course: course._id,
      amount,
      utrNumber: normalizedUtr,
      screenshotUrl,
      status: 'submitted',
      receipt: generateReceipt(),
    });
    application.payment = payment._id;
  } else {
    payment.utrNumber = normalizedUtr;
    payment.screenshotUrl = screenshotUrl;
    payment.amount = amount;
    payment.status = 'submitted';
    await payment.save();
  }

  application.status = 'payment_submitted';
  await application.save();

  return payment;
};
