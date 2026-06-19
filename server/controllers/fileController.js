const supabase = require('../config/supabase');

const BUCKET_NAME = 'student-files';

// ─────────────────────────────────────────
// UPLOAD FILE
// ─────────────────────────────────────────
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const folder = req.body.folder || 'general'; // optional folder path
    const timestamp = Date.now();
    const filePath = `${folder}/${timestamp}_${originalname}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        path: data.path,
        publicUrl: urlData.publicUrl,
        name: originalname,
        folder
      }
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────
// GET FILE BY PATH
// ─────────────────────────────────────────
const getFileByPath = async (req, res) => {
  try {
    // Path passed as query param: /files?path=general/123_file.pdf
    const filePath = req.query.path;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Get public URL for the file
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(200).json({
      message: 'File retrieved successfully',
      file: {
        path: filePath,
        publicUrl: data.publicUrl
      }
    });

  } catch (error) {
    console.error('Get file error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────
// LIST FILES IN A FOLDER/PATH
// ─────────────────────────────────────────
const listFilesByFolder = async (req, res) => {
  try {
    const folder = req.params.folder || 'general';

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 50,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;

    // Attach public URLs to each file
    const filesWithUrls = data.map(file => {
      const filePath = `${folder}/${file.name}`;
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        name: file.name,
        path: filePath,
        size: file.metadata?.size,
        createdAt: file.created_at,
        publicUrl: urlData.publicUrl
      };
    });

    return res.status(200).json({
      message: 'Files retrieved successfully',
      folder,
      count: filesWithUrls.length,
      files: filesWithUrls
    });

  } catch (error) {
    console.error('List files error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFile, getFileByPath, listFilesByFolder };