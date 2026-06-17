import express from 'express';
import {
  generateCertificate,
  submitCompletion,
  verifyCertificate,
  verifyByInternshipId,
  getMyCertificates,
  getAllCertificates,
} from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);
router.get('/verify-by-internship/:internshipId', verifyByInternshipId);
router.post('/generate', protect, generateCertificate);
router.post('/complete', protect, submitCompletion);
router.get('/my', protect, getMyCertificates);
router.get('/all', protect, authorize('admin'), getAllCertificates);

export default router;
