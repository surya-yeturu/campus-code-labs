import Certificate from '../models/Certificate.js';
import Internship from '../models/Internship.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { generateCertificateId, generateCertificateNo } from '../utils/generateId.js';
import { generateCertificatePDF } from './pdfService.js';
import { uploadBuffer } from './storageService.js';
import QRCode from 'qrcode';
import { sendCertificateEmail } from './emailService.js';

const toAbsoluteUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const base = process.env.SERVER_URL || process.env.API_URL || process.env.CLIENT_URL || '';
  return `${base.replace(/\/$/, '')}${value.startsWith('/') ? value : `/${value}`}`;
};

const resolveApplicant = async (internship, applicant) => {
  if (applicant?.fullName && applicant?.email) return applicant;

  if (internship.studentFullName && internship.studentEmail) {
    return {
      fullName: internship.studentFullName,
      email: internship.studentEmail,
      collegeName: internship.collegeName,
      branch: internship.branch,
      year: internship.year,
      internshipFromDate: internship.startDate,
      internshipToDate: internship.endDate,
      projectTitle: internship.projectTitle || '',
      certificateDate: applicant?.certificateDate,
    };
  }

  if (internship.user) {
    const user = applicant?._id ? applicant : await User.findById(internship.user);
    if (user) {
      return {
        fullName: user.fullName,
        email: user.email,
        collegeName: user.collegeName,
        branch: user.branch,
        year: user.year,
        internshipFromDate: internship.startDate,
        internshipToDate: internship.endDate,
        projectTitle: internship.projectTitle || '',
        certificateDate: applicant?.certificateDate,
      };
    }
  }

  throw new Error('Student details not found for certificate');
};

export const issueCertificateForInternship = async (internship, applicant, { sendEmail = true } = {}) => {
  if (internship.certificate) {
    const existing = await Certificate.findById(internship.certificate);
    if (existing) return existing;
  }

  const course = await Course.findById(internship.course._id || internship.course);
  const student = await resolveApplicant(internship, applicant);
  const certificateId = generateCertificateId();
  const certificateNo = generateCertificateNo();
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${certificateId}`;
  const certificateOpenUrl = `${verifyUrl}?open=certificate`;
  const issueDate = student.certificateDate ? new Date(student.certificateDate) : new Date();

  const pdfBuffer = await generateCertificatePDF({
    studentName: student.fullName,
    email: student.email,
    collegeName: student.collegeName,
    branch: student.branch,
    year: student.year,
    courseName: course.title,
    internshipId: internship.internshipId,
    duration: internship.duration,
    certificateId,
    certificateNo,
    issueDate,
    internshipFromDate: student.internshipFromDate || internship.startDate,
    internshipToDate: student.internshipToDate || internship.endDate,
    projectTitle: student.projectTitle || internship.projectTitle || '',
    verifyUrl: certificateOpenUrl,
  });

  let certificateUrl = '';
  let qrCodeUrl = '';

  try {
    const certUpload = await uploadBuffer(pdfBuffer, 'certificates', `${certificateId}.pdf`, 'application/pdf');
    certificateUrl = certUpload.viewUrl || certUpload.url || certUpload.secure_url;

    const qrBuffer = await QRCode.toBuffer(certificateOpenUrl, { width: 300 });
    const qrUpload = await uploadBuffer(qrBuffer, 'certificates', `${certificateId}-qr.png`, 'image/png');
    qrCodeUrl = toAbsoluteUrl(qrUpload.url || qrUpload.viewUrl || qrUpload.secure_url);
  } catch (err) {
    console.error('Certificate upload error:', err.message);
    certificateUrl = verifyUrl;
  }

  const certificate = await Certificate.create({
    certificateId,
    application: internship.application,
    email: student.email,
    collegeName: student.collegeName,
    branch: student.branch,
    year: student.year,
    internshipFromDate: student.internshipFromDate || internship.startDate,
    internshipToDate: student.internshipToDate || internship.endDate,
    projectTitle: student.projectTitle || internship.projectTitle || '',
    certificateNo,
    user: internship.user || undefined,
    internship: internship._id,
    course: course._id,
    studentName: student.fullName,
    courseName: course.title,
    duration: internship.duration,
    completionDate: issueDate,
    certificateUrl,
    qrCodeUrl,
  });

  internship.certificate = certificate._id;
  if (internship.status === 'active') internship.status = 'completed';
  await internship.save();

  if (sendEmail) {
    await sendCertificateEmail(student, certificate, certificateUrl, {
      filename: `Internship-Certificate-${certificate.certificateNo || certificate.certificateId}.pdf`,
      content: pdfBuffer,
    }).catch(console.error);
  }

  return certificate;
};

export const autoGenerateDueCertificates = async () => {
  const now = new Date();
  const inThreeDays = new Date();
  inThreeDays.setDate(inThreeDays.getDate() + 3);

  const internships = await Internship.find({
    status: 'active',
    user: { $exists: true, $ne: null },
    $or: [{ certificate: null }, { certificate: { $exists: false } }],
    endDate: { $lte: inThreeDays },
  }).populate('user');

  const results = [];
  for (const internship of internships) {
    try {
      const cert = await issueCertificateForInternship(internship, internship.user, { sendEmail: true });
      results.push({ internshipId: internship.internshipId, certificateId: cert.certificateId });
    } catch (err) {
      console.error(`Auto-cert failed for ${internship.internshipId}:`, err.message);
    }
  }
  return results;
};
