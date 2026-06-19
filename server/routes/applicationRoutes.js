import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import {
  submitApplication,
  getApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many applications from this IP. Please try again later.' },
});

const applicationValidators = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 120 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 20 }),
  body('collegeName').trim().notEmpty().withMessage('College name is required').isLength({ max: 200 }),
  body('branch').trim().notEmpty().withMessage('Branch is required').isLength({ max: 100 }),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('courseId').notEmpty().withMessage('Internship program is required').isMongoId(),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('internshipFromDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Valid start date required'),
  body('internshipToDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Valid end date required'),
  body('projectTitle').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
];

router.post('/', applyLimiter, applicationValidators, validate, submitApplication);
router.get('/status/:applicationId', getApplicationStatus);
router.get('/', protect, authorize('admin'), getAllApplications);
router.post('/:id/approve', protect, authorize('admin'), approveApplication);
router.post('/:id/reject', protect, authorize('admin'), rejectApplication);

export default router;
