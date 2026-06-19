import express from 'express';
import { getPaymentSettings, getPaymentQrCode, updatePaymentSettings } from '../controllers/paymentSettingsController.js';
import { uploadQrCode } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPaymentSettings);
router.get('/qr', getPaymentQrCode);
router.put('/', protect, authorize('admin'), uploadQrCode, updatePaymentSettings);

export default router;
