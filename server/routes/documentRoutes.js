import express from 'express';
import { getMyDocuments } from '../controllers/recommendationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, getMyDocuments);

export default router;
