import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitManualPayment,
  verifyManualPayment,
  rejectManualPayment,
  getPaymentByApplication,
  getMyPayments,
  getAllPayments,
} from '../controllers/paymentController.js';
import { uploadPaymentScreenshot } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const paymentSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment submissions. Please try again later.' },
});

router.get('/settings', (_req, res) => res.redirect('/api/payment-settings'));
router.get('/application', getPaymentByApplication);
router.post('/submit', paymentSubmitLimiter, uploadPaymentScreenshot, submitManualPayment);
router.post('/:id/verify', protect, authorize('admin'), verifyManualPayment);
router.post('/:id/reject', protect, authorize('admin'), rejectManualPayment);
router.get('/my', protect, getMyPayments);
router.get('/all', protect, authorize('admin'), getAllPayments);

export default router;
