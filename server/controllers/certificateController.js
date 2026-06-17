import Certificate from '../models/Certificate.js';
import Internship from '../models/Internship.js';
import { issueCertificateForInternship } from '../services/certificateService.js';

export const generateCertificate = async (req, res) => {
  const { internshipId } = req.body;
  const internship = await Internship.findById(internshipId).populate('course');
  if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

  if (req.user.role !== 'admin' && internship.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  if (!['active', 'completed'].includes(internship.status)) {
    return res.status(400).json({ success: false, message: 'Internship must be active to generate certificate' });
  }

  const certificate = await issueCertificateForInternship(internship, req.user, { sendEmail: true });
  res.json({ success: true, message: 'Certificate generated', data: certificate });
};

export const verifyCertificate = async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found',
      verified: false,
    });
  }
  res.json({
    success: true,
    verified: certificate.isVerified,
    data: {
      certificateId: certificate.certificateId,
      certificateNo: certificate.certificateNo,
      studentName: certificate.studentName,
      email: certificate.email,
      collegeName: certificate.collegeName,
      branch: certificate.branch,
      year: certificate.year,
      internshipFromDate: certificate.internshipFromDate,
      internshipToDate: certificate.internshipToDate,
      projectTitle: certificate.projectTitle,
      courseName: certificate.courseName,
      duration: certificate.duration,
      completionDate: certificate.completionDate,
      certificateUrl: certificate.certificateUrl,
      qrCodeUrl: certificate.qrCodeUrl,
      status: certificate.isVerified ? 'Valid' : 'Invalid',
    },
  });
};

export const verifyByInternshipId = async (req, res) => {
  const internship = await Internship.findOne({ internshipId: req.params.internshipId }).populate('certificate');
  if (!internship) {
    return res.status(404).json({ success: false, message: 'Internship not found', verified: false });
  }
  if (!internship.certificate) {
    return res.status(404).json({ success: false, message: 'No certificate issued for this internship yet', verified: false });
  }
  const certificate = await Certificate.findById(internship.certificate);
  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found', verified: false });
  }
  res.json({
    success: true,
    verified: certificate.isVerified,
    data: {
      certificateId: certificate.certificateId,
      certificateNo: certificate.certificateNo,
      internshipId: internship.internshipId,
      studentName: certificate.studentName,
      email: certificate.email,
      collegeName: certificate.collegeName,
      branch: certificate.branch,
      year: certificate.year,
      internshipFromDate: certificate.internshipFromDate,
      internshipToDate: certificate.internshipToDate,
      projectTitle: certificate.projectTitle,
      courseName: certificate.courseName,
      duration: certificate.duration,
      completionDate: certificate.completionDate,
      certificateUrl: certificate.certificateUrl,
      qrCodeUrl: certificate.qrCodeUrl,
      status: certificate.isVerified ? 'Valid' : 'Invalid',
    },
  });
};

export const getMyCertificates = async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: certificates });
};

export const getAllCertificates = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const filter = search ? { certificateId: { $regex: search, $options: 'i' } } : {};
  const skip = (page - 1) * limit;
  const [certificates, total] = await Promise.all([
    Certificate.find(filter)
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Certificate.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: certificates,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
};

// Legacy — redirects to instant generate
export const submitCompletion = async (req, res) => {
  req.body.internshipId = req.body.internshipId;
  return generateCertificate(req, res);
};
