import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
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

router.get('/settings', (_req, res) => res.redirect('/api/payment-settings'));
router.get('/application', getPaymentByApplication);
router.post('/submit', uploadPaymentScreenshot, submitManualPayment);
router.post('/:id/verify', protect, authorize('admin'), verifyManualPayment);
router.post('/:id/reject', protect, authorize('admin'), rejectManualPayment);
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyPayments);
router.get('/all', protect, authorize('admin'), getAllPayments);

export default router;
