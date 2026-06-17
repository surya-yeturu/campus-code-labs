import express from 'express';
import {
  createNote, getAllNotes, updateNote, deleteNote, getMyNotes,
} from '../controllers/noteController.js';
import { uploadNote } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, getMyNotes);
router.get('/', protect, authorize('admin'), getAllNotes);
router.post('/', protect, authorize('admin'), uploadNote, createNote);
router.put('/:id', protect, authorize('admin'), uploadNote, updateNote);
router.delete('/:id', protect, authorize('admin'), deleteNote);

export default router;
