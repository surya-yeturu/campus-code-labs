import PaymentSettings from '../models/PaymentSettings.js';

export const getPaymentSettings = async (_req, res) => {
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = await PaymentSettings.create({ upiId: '', qrCodeUrl: '' });
  }
  res.json({ success: true, data: settings });
};

export const updatePaymentSettings = async (req, res) => {
  const { upiId } = req.body;
  const update = {};
  if (upiId !== undefined) update.upiId = upiId;
  if (req.file) update.qrCodeUrl = `/uploads/payment-settings/${req.file.filename}`;

  const settings = await PaymentSettings.findOneAndUpdate(
    {},
    update,
    { new: true, upsert: true }
  );
  res.json({ success: true, data: settings });
};
