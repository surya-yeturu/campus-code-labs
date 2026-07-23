import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { submitApplication } from '../controllers/salesforceController.js';
import { validate } from '../middleware/validate.js';
import { uploadResume } from '../middleware/upload.js';

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
  body('college').trim().notEmpty().withMessage('College name is required').isLength({ max: 200 }),
  body('branch').trim().notEmpty().withMessage('Branch is required').isLength({ max: 100 }),
  body('passingYear').trim().notEmpty().withMessage('Passing year is required'),
  body('location').trim().notEmpty().withMessage('Location is required').isLength({ max: 200 }),
  body('currentStatus')
    .isIn(['Student', 'Graduate', 'Working Professional'])
    .withMessage('Valid current status required'),
  body('experience')
    .isIn(['Fresher', '0-1 Years', '1-2 Years', '2+ Years'])
    .withMessage('Valid experience required'),
  body('interestedRole')
    .isIn(['Salesforce Developer', 'Salesforce Administrator', 'Both'])
    .withMessage('Valid role selection required'),
  body('preferredBatch')
    .isIn(['Morning', 'Evening', 'Weekend'])
    .withMessage('Valid batch preference required'),
  body('reason').trim().notEmpty().withMessage('Reason is required').isLength({ max: 2000 }),
  body('agreed').custom((val) => val === true || val === 'true').withMessage('You must agree to be contacted'),
];

router.post('/apply', applyLimiter, uploadResume, applicationValidators, validate, submitApplication);

export default router;
