import express from 'express';
import {
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from '../controllers/salesforceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.patch('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
