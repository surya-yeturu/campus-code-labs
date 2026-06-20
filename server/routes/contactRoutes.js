import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { submitContactMessage } from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many contact messages. Please try again later.' },
});

const contactValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

router.post('/', contactLimiter, contactValidators, validate, submitContactMessage);

export default router;
