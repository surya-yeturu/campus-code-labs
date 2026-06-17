import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema(
  {
    upiId: { type: String, default: '' },
    qrCodeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);
export default PaymentSettings;
