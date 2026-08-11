import express from 'express';
import {
  createFinalYearProject,
  deleteFinalYearProject,
  getAllFinalYearProjects,
  getPublicFinalYearProjects,
  updateFinalYearProject,
} from '../controllers/finalYearProjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicFinalYearProjects);
router.get('/', protect, authorize('admin'), getAllFinalYearProjects);
router.post('/', protect, authorize('admin'), createFinalYearProject);
router.put('/:id', protect, authorize('admin'), updateFinalYearProject);
router.delete('/:id', protect, authorize('admin'), deleteFinalYearProject);

export default router;
