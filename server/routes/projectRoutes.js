import express from 'express';
import {
  createProject, getAllProjects, updateProject, deleteProject, getMyProjects, submitProject,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, getMyProjects);
router.post('/:id/submit', protect, submitProject);
router.get('/', protect, authorize('admin'), getAllProjects);
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;
