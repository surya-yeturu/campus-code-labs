import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const apiBase = import.meta.env.VITE_API_URL || '/api';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({ upiId: '', hasQrCode: false });
  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/payment-settings').then(({ data }) => setSettings(data.data)).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('upiId', settings.upiId);
      if (qrFile) payload.append('qrCode', qrFile);
      const { data } = await api.put('/payment-settings', payload);
      setSettings(data.data);
      setQrFile(null);
      toast.success('Payment settings updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-2xl font-bold mb-6">Payment Settings</h2>
      <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
        <div>
          <label className="text-sm font-medium">UPI ID</label>
          <input
            className="input-field mt-1"
            placeholder="e.g. campus@upi"
            value={settings.upiId}
            onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">UPI QR Code</label>
          <p className="text-xs text-slate-500 mt-1 mb-2">
            Upload your UPI QR image. It is stored in MongoDB and shown to all users on the payment page.
          </p>
          {settings.hasQrCode && (
            <img
              src={`${apiBase}/payment-settings/qr?t=${settings.updatedAt || Date.now()}`}
              alt="Current QR"
              className="w-40 h-40 mt-2 rounded-lg border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="input-field mt-2"
            onChange={(e) => setQrFile(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default PaymentSettings;
