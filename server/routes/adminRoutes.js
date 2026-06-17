import express from 'express';
import {
  getDashboardStats,
  getStudents,
  getReviews,
  toggleStudentStatus,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/students', getStudents);
router.get('/reviews', getReviews);
router.put('/students/:id/toggle', toggleStudentStatus);

export default router;
