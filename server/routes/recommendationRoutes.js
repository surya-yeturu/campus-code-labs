import express from 'express';
import {
  getAllRecommendations,
  approveRecommendation,
  rejectRecommendation,
  generateRecommendation,
} from '../controllers/recommendationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllRecommendations);
router.post('/generate', protect, authorize('admin'), generateRecommendation);
router.post('/:id/approve', protect, authorize('admin'), approveRecommendation);
router.post('/:id/reject', protect, authorize('admin'), rejectRecommendation);

export default router;
