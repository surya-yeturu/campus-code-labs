import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

export const uploadBuffer = (buffer, folder, filename) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `learnovate/${folder}`,
        public_id: filename,
        resource_type: 'raw',
        format: 'pdf',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });

export const uploadImageBuffer = (buffer, folder, filename) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `learnovate/${folder}`,
        public_id: filename,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });

export const uploadFromUrl = async (url, folder, filename) => {
  const result = await cloudinary.uploader.upload(url, {
    folder: `learnovate/${folder}`,
    public_id: filename,
    resource_type: 'auto',
  });
  return result;
};
