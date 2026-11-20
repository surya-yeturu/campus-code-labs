import mongoose from 'mongoose';

const bucketName = 'campusFiles';
let bucket;
let bucketDb;

export const getFileBucket = () => {
  if (!mongoose.connection.db) throw new Error('MongoDB is not connected');
  if (!bucket || bucketDb !== mongoose.connection.db) {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName });
    bucketDb = mongoose.connection.db;
  }
  return bucket;
};

export const createFileUrl = (id) => {
  const route = `/api/files/${id}`;
  const base = process.env.SERVER_URL || process.env.API_URL || process.env.CLIENT_URL || '';
  const normalizedBase = base.replace(/\/api\/?$/i, '').replace(/\/$/, '');
  return normalizedBase ? `${normalizedBase}${route}` : route;
};

export const uploadBuffer = async (buffer, folder, filename, contentType = 'application/octet-stream') => {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('File contents must be a Buffer');

  const upload = getFileBucket().openUploadStream(filename, {
    contentType,
    metadata: { folder, originalName: filename },
  });

  await new Promise((resolve, reject) => {
    upload.once('finish', resolve);
    upload.once('error', reject);
    upload.end(buffer);
  });

  const url = createFileUrl(upload.id.toString());
  return {
    id: upload.id.toString(),
    url,
    viewUrl: url,
    path: upload.id.toString(),
    provider: 'mongodb-gridfs',
  };
};

export const getFileById = (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return getFileBucket().find({ _id: new mongoose.Types.ObjectId(id) }).next();
};

export const openFileDownloadStream = (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return getFileBucket().openDownloadStream(new mongoose.Types.ObjectId(id));
};

export const deleteStoredFile = (id) => {
  if (!mongoose.isValidObjectId(id)) return Promise.resolve();
  return getFileBucket().delete(new mongoose.Types.ObjectId(id));
};

export const listStoredFiles = (folder) => {
  const filter = folder ? { 'metadata.folder': folder } : {};
  return getFileBucket().find(filter).sort({ uploadDate: -1 }).toArray();
};

export const uploadImageBuffer = async (buffer, folder, filename) =>
  uploadBuffer(buffer, folder, `${filename}.png`, 'image/png');
