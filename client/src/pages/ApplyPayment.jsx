import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const apiBase = import.meta.env.VITE_API_URL || '/api';

const ApplyPayment = () => {
  const { applicationId } = useParams();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [application, setApplication] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [form, setForm] = useState({ utrNumber: '', screenshot: null });

  const fetchApplication = async (userEmail) => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const [{ data: appData }, { data: settingsData }] = await Promise.all([
        api.get(`/applications/status/${applicationId}`, { params: { email: userEmail } }),
        api.get('/payment-settings'),
      ]);
      setApplication(appData.data);
      setSettings(settingsData.data);
      setVerified(true);
    } catch {
      toast.error('Application not found or email mismatch');
      setApplication(null);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('email')) fetchApplication(searchParams.get('email'));
  }, [applicationId, searchParams]);

  const handleEmailVerify = (e) => {
    e.preventDefault();
    fetchApplication(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('applicationId', applicationId);
      payload.append('email', email);
      payload.append('utrNumber', form.utrNumber);
      payload.append('screenshot', form.screenshot);
      await api.post('/payments/submit', payload);
      toast.success('Payment submitted! Admin will verify shortly.');
      fetchApplication(email);
      setForm({ utrNumber: '', screenshot: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!verified) {
    return (
      <div className="py-12 min-h-[80vh]">
        <div className="max-w-md mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="section-title">Complete Payment</h1>
            <p className="section-subtitle mx-auto mt-4">Enter your email to continue with payment</p>
          </motion.div>
          <form onSubmit={handleEmailVerify} className="glass-card p-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Application ID</label>
              <input className="input-field mt-1 bg-slate-50" value={applicationId} readOnly />
            </div>
            <div>
              <label className="text-sm font-medium">Email used in application</label>
              <input
                type="email"
                required
                className="input-field mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  const isSubmitted = ['payment_submitted', 'approved'].includes(application?.status);
  const isApproved = application?.status === 'approved';

  return (
    <div className="py-12 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="section-title">Complete Payment</h1>
          <p className="text-slate-600 mt-2">{application?.course?.title}</p>
        </motion.div>

        {isApproved ? (
          <div className="glass-card p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-green-600 mb-2">Application Approved!</h2>
            <p className="text-slate-600 mb-2">Your offer letter and internship certificate have been sent to <strong>{email}</strong>.</p>
            <p className="text-sm text-slate-500">Scan the QR code on your certificate to verify it anytime.</p>
          </div>
        ) : isSubmitted ? (
          <div className="glass-card p-8 text-center">
            <CheckCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Payment Submitted</h2>
            <p className="text-slate-600">Your payment is under verification. You will receive an email once approved.</p>
            {application?.payment?.utrNumber && (
              <p className="text-sm text-slate-500 mt-4">UTR: {application.payment.utrNumber}</p>
            )}
          </div>
        ) : (
          <>
            <div className="glass-card p-8 mb-6 text-center">
              <h3 className="font-semibold mb-4">Pay via UPI</h3>
              {settings?.hasQrCode && (
                <img
                  src={`${apiBase}/payment-settings/qr?t=${settings.updatedAt || Date.now()}`}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto mb-4 rounded-xl border border-slate-200"
                />
              )}
              {settings?.upiId && (
                <p className="text-lg font-mono bg-brand-50 dark:bg-brand-900/50 px-4 py-2 rounded-lg inline-block">
                  {settings.upiId}
                </p>
              )}
              {!settings?.upiId && !settings?.hasQrCode && (
                <p className="text-slate-500">Payment details will be shared via email.</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
              <div>
                <label className="text-sm font-medium">UTR / Transaction Number</label>
                <input
                  required
                  className="input-field mt-1"
                  placeholder="Enter UTR number"
                  value={form.utrNumber}
                  onChange={(e) => setForm({ ...form, utrNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Payment Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="input-field mt-1"
                  onChange={(e) => setForm({ ...form, screenshot: e.target.files[0] })}
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                <Upload className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Payment'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyPayment;
