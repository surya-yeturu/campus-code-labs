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
} from '../services/emailService.js';

const parseDurationWeeks = (duration) => {
  const match = String(duration).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 8;
};

const toAbsoluteUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${(process.env.CLIENT_URL || '').replace(/\/$/, '')}${value.startsWith('/') ? value : `/${value}`}`;
};

export const processApplicationApproval = async (application, adminUser) => {
  const course = await Course.findById(application.course);
  if (!course) throw new Error('Course not found');

  const paymentId = application.payment?._id || application.payment;
  const payment = paymentId ? await Payment.findById(paymentId) : null;
  if (!payment) throw new Error('Payment record not found');
  if (payment.status !== 'submitted') throw new Error('Payment must be submitted before approval');

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

  const weeks = parseDurationWeeks(application.duration);
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

  const certificate = await issueCertificateForInternship(internship, applicant, { sendEmail: true });

  application.internship = internship._id;
  application.certificate = certificate._id;
  application.status = 'approved';
  await application.save();

  await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

  await Promise.allSettled([
    sendOfferLetterEmail(applicant, internship, offerLetterUrl, {
      filename: `Internship-Offer-Letter-${internship.internshipId}.pdf`,
      content: pdfBuffer,
    }),
  ]);

  return { internship, payment, application, certificate };
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
