import Internship from '../models/Internship.js';
import Certificate from '../models/Certificate.js';
import RecommendationLetter from '../models/RecommendationLetter.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { generateRecommendationPDF } from '../services/pdfService.js';
import { uploadBuffer } from '../services/storageService.js';
import { sendRecommendationEmail } from '../services/emailService.js';

export const getMyDocuments = async (req, res) => {
  const internships = await Internship.find({ user: req.user._id })
    .populate('course', 'title')
    .populate('certificate');
  const certificates = await Certificate.find({ user: req.user._id });
  const recommendations = await RecommendationLetter.find({
    user: req.user._id,
    status: 'approved',
  }).populate('course', 'title');

  res.json({
    success: true,
    data: {
      offerLetters: internships.filter((i) => i.offerLetterUrl).map((i) => ({
        internshipId: i.internshipId,
        courseName: i.course?.title,
        url: i.offerLetterUrl,
        issuedAt: i.createdAt,
      })),
      certificates: certificates.map((c) => ({
        certificateId: c.certificateId,
        courseName: c.courseName,
        url: c.certificateUrl,
        issuedAt: c.completionDate,
      })),
      recommendationLetters: recommendations.map((r) => ({
        courseName: r.course?.title,
        url: r.fileUrl,
        issuedAt: r.issuedAt,
      })),
    },
  });
};

export const getAllRecommendations = async (req, res) => {
  const letters = await RecommendationLetter.find()
    .populate('user', 'fullName email')
    .populate('course', 'title')
    .populate('internship', 'internshipId')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: letters });
};

export const requestRecommendation = async (req, res) => {
  const internship = await Internship.findOne({ _id: req.body.internshipId, user: req.user._id });
  if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

  const existing = await RecommendationLetter.findOne({ internship: internship._id });
  if (existing) return res.status(400).json({ success: false, message: 'Recommendation already requested' });

  const letter = await RecommendationLetter.create({
    user: req.user._id,
    internship: internship._id,
    course: internship.course,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: letter });
};

export const approveRecommendation = async (req, res) => {
  const letter = await RecommendationLetter.findById(req.params.id)
    .populate('user')
    .populate({ path: 'internship', select: 'internshipId' });
  if (!letter) return res.status(404).json({ success: false, message: 'Not found' });

  const course = await Course.findById(letter.course);
  const pdfBuffer = await generateRecommendationPDF({
    studentName: letter.user.fullName,
    courseName: course.title,
    internshipId: letter.internship.internshipId,
    issueDate: new Date(),
  });

  let fileUrl = '';
  try {
    const upload = await uploadBuffer(pdfBuffer, 'offer-letters', `rec-${letter._id}.pdf`, 'application/pdf');
    fileUrl = upload.url;
  } catch {
    fileUrl = '';
  }

  letter.status = 'approved';
  letter.fileUrl = fileUrl;
  letter.approvedBy = req.user._id;
  letter.issuedAt = new Date();
  await letter.save();

  if (fileUrl) sendRecommendationEmail(letter.user, fileUrl).catch(console.error);
  res.json({ success: true, data: letter });
};

export const rejectRecommendation = async (req, res) => {
  const letter = await RecommendationLetter.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!letter) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: letter });
};

export const generateRecommendation = async (req, res) => {
  const { userId, internshipId } = req.body;
  const internship = await Internship.findById(internshipId);
  if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

  let letter = await RecommendationLetter.findOne({ internship: internshipId });
  if (!letter) {
    letter = await RecommendationLetter.create({
      user: userId || internship.user,
      internship: internship._id,
      course: internship.course,
      status: 'pending',
    });
  }
  req.params.id = letter._id.toString();
  return approveRecommendation(req, res);
};
