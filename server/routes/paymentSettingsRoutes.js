import express from 'express';
import { getPaymentSettings, updatePaymentSettings } from '../controllers/paymentSettingsController.js';
import { uploadQrCode } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPaymentSettings);
router.put('/', protect, authorize('admin'), uploadQrCode, updatePaymentSettings);

export default router;
