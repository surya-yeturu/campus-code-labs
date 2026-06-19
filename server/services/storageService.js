import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';
import { isGoogleDriveConfigured, uploadToGoogleDrive } from './googleDriveService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localRoot = path.join(__dirname, '../uploads');

const bucketMap = {
  'offer-letters': 'offer-letters',
  certificates: 'certificates',
  'qr-codes': 'certificates',
  notes: 'notes',
  resumes: 'resumes',
  payments: 'payments',
};

const googleDriveFolders = new Set(['certificates', 'payments']);

const ensureLocalDir = (folder) => {
  const dir = path.join(localRoot, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const uploadLocal = (buffer, folder, filename) => {
  const dir = ensureLocalDir(folder);
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return { url: `/uploads/${folder}/${filename}`, path: filePath };
};

export const uploadBuffer = async (buffer, folder, filename, contentType = 'application/octet-stream') => {
  if (googleDriveFolders.has(folder) && isGoogleDriveConfigured()) {
    return uploadToGoogleDrive(buffer, folder, filename, contentType);
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const bucket = bucketMap[folder] || folder;
    const storagePath = `${folder}/${filename}`;
    const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return { url: data.publicUrl, path: storagePath };
  }
  return uploadLocal(buffer, folder, filename);
};

export const uploadImageBuffer = async (buffer, folder, filename) =>
  uploadBuffer(buffer, folder, `${filename}.png`, 'image/png');

export const uploadFromPath = async (filePath, folder, filename, contentType) => {
  const buffer = fs.readFileSync(filePath);
  return uploadBuffer(buffer, folder, filename, contentType);
};
