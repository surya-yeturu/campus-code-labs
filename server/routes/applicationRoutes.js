import express from 'express';
import {
  submitApplication,
  getApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitApplication);
router.get('/status/:applicationId', getApplicationStatus);
router.get('/', protect, authorize('admin'), getAllApplications);
router.post('/:id/approve', protect, authorize('admin'), approveApplication);
router.post('/:id/reject', protect, authorize('admin'), rejectApplication);

export default router;
