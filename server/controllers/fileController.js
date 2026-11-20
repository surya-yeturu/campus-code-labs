import { getFileById, listStoredFiles, openFileDownloadStream, uploadBuffer } from '../services/storageService.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const filename = `${Date.now()}-${req.file.originalname.replace(/[\\/]/g, '_')}`;
    const file = await uploadBuffer(req.file.buffer, req.body.folder || 'general', filename, req.file.mimetype);
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: { id: file.id, path: file.path, url: file.url, name: req.file.originalname, folder: req.body.folder || 'general' },
    });
  } catch (error) {
    console.error('MongoDB file upload error:', error.message);
    return res.status(500).json({ success: false, message: 'File upload failed' });
  }
};

export const getFileByPath = async (req, res) => {
  const fileId = req.query.path;
  if (!fileId) return res.status(400).json({ success: false, message: 'File ID is required' });
  try {
    const file = await getFileById(fileId);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    return res.json({ success: true, file: { id: file._id, name: file.filename, url: `/api/files/${file._id}` } });
  } catch (error) {
    console.error('MongoDB file lookup error:', error.message);
    return res.status(500).json({ success: false, message: 'File lookup failed' });
  }
};

export const listFilesByFolder = async (req, res) => {
  try {
    const files = await listStoredFiles(req.params.folder);
    const filesWithUrls = files.map((file) => ({
      id: file._id,
      name: file.filename,
      path: file._id,
      size: file.length,
      createdAt: file.uploadDate,
      url: `/api/files/${file._id}`,
    }));
    return res.json({ success: true, folder: req.params.folder, count: filesWithUrls.length, files: filesWithUrls });
  } catch (error) {
    console.error('MongoDB file listing error:', error.message);
    return res.status(500).json({ success: false, message: 'File listing failed' });
  }
};

export const streamStoredFile = async (req, res) => {
  try {
    const file = await getFileById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Length': String(file.length),
      'Content-Disposition': `inline; filename="${String(file.filename).replace(/[\r\n"\\]/g, '_')}"`,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });
    const stream = openFileDownloadStream(req.params.id);
    stream.on('error', (error) => {
      console.error('MongoDB file stream error:', error.message);
      if (!res.headersSent) res.status(404).json({ success: false, message: 'File not found' });
      else res.destroy(error);
    });
    stream.pipe(res);
  } catch (error) {
    console.error('MongoDB file read error:', error.message);
    return res.status(500).json({ success: false, message: 'File read failed' });
  }
};
