import PaymentSettings from '../models/PaymentSettings.js';
import fs from 'fs';

const formatSettings = (settings) => ({
  _id: settings._id,
  upiId: settings.upiId,
  hasQrCode: Boolean(settings.qrCodeData?.length),
  updatedAt: settings.updatedAt,
});

export const getPaymentSettings = async (_req, res) => {
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = await PaymentSettings.create({ upiId: '' });
  }
  res.json({ success: true, data: formatSettings(settings) });
};

export const getPaymentQrCode = async (_req, res) => {
  const settings = await PaymentSettings.findOne();
  if (!settings?.qrCodeData?.length) {
    return res.status(404).json({ success: false, message: 'QR code not configured' });
  }
  res.set('Content-Type', settings.qrCodeContentType || 'image/png');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(settings.qrCodeData);
};

export const updatePaymentSettings = async (req, res) => {
  const { upiId } = req.body;
  const update = {};
  if (upiId !== undefined) update.upiId = upiId;

  if (req.file) {
    const buffer = req.file.buffer || fs.readFileSync(req.file.path);
    update.qrCodeData = buffer;
    update.qrCodeContentType = req.file.mimetype || 'image/png';
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }

  const settings = await PaymentSettings.findOneAndUpdate({}, update, { new: true, upsert: true });
  res.json({ success: true, data: formatSettings(settings) });
};
