import express from 'express';
import {
  getFileByPath, listFilesByFolder, uploadFile } from '../controllers/fileController.js';
import { upload } from '../middleware/upload1.js';


const router = express.Router();

// POST /api/files/upload
router.post('/upload', upload.single('file'), uploadFile);

// GET /api/files?path=folder/filename.ext
router.get('/', getFileByPath);

// GET /api/files/folder/:folder
router.get('/folder/:folder', listFilesByFolder);

export default router;