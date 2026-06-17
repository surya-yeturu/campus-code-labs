import express from 'express';
import {
  createInternship,
  getMyInternships,
  getInternship,
  getAllInternships,
  updateInternshipStatus,
} from '../controllers/internshipController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createInternship);
router.get('/my', protect, getMyInternships);
router.get('/all', protect, authorize('admin'), getAllInternships);
router.get('/:id', protect, getInternship);
router.put('/:id/status', protect, authorize('admin'), updateInternshipStatus);

export default router;
