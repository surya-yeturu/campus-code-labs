import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema(
  {
    upiId: { type: String, default: '' },
    qrCodeData: { type: Buffer },
    qrCodeContentType: { type: String, default: 'image/png' },
  },
  { timestamps: true }
);

const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);
export default PaymentSettings;
