import express from 'express';
import {
  getFileByPath, listFilesByFolder, streamStoredFile, uploadFile } from '../controllers/fileController.js';
import { upload } from '../middleware/upload1.js';
import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();

// POST /api/files/upload
router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadFile);

// GET /api/files?path=folder/filename.ext
router.get('/', protect, authorize('admin'), getFileByPath);

// GET /api/files/folder/:folder
router.get('/folder/:folder', protect, authorize('admin'), listFilesByFolder);
router.get('/:id', streamStoredFile);

export default router;
