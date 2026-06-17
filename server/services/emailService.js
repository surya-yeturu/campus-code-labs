import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import {
  registrationTemplate,
  paymentSuccessTemplate,
  offerLetterTemplate,
  completionTemplate,
  certificateTemplate,
  applicationReceivedTemplate,
  paymentApprovedTemplate,
  welcomeCredentialsTemplate,
  recommendationTemplate,
} from '../templates/emailTemplates.js';

const isPlaceholder = (value) =>
  !value || /your_|xxxxx|example\.com|changeme/i.test(String(value));

const getEmailProvider = () => {
  if (process.env.RESEND_API_KEY && !isPlaceholder(process.env.RESEND_API_KEY)) return 'resend';
  if (process.env.SMTP_USER && !isPlaceholder(process.env.SMTP_USER)) return 'smtp';
  return 'mock';
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const getFromAddress = () =>
  process.env.EMAIL_FROM || 'Campus Code Labs <onboarding@resend.dev>';

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const provider = getEmailProvider();
  const from = getFromAddress();

  if (provider === 'mock') {
    console.log('\n========== EMAIL (MOCK — not sent) ==========');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Configure RESEND_API_KEY or SMTP_USER/SMTP_PASS in server/.env to send real emails.');
    console.log('=============================================\n');
    return { success: true, mock: true };
  }

  try {
    if (provider === 'resend') {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({ from, to, subject, html });
      if (error) throw new Error(error.message);
      console.log(`[Email] Sent via Resend → ${to} | ${subject}`);
      return { success: true };
    }

    const transporter = createTransporter();
    await transporter.sendMail({ from, to, subject, html, attachments });
    console.log(`[Email] Sent via SMTP → ${to} | ${subject}`);
    return { success: true };
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message);
    throw err;
  }
};

export const sendRegistrationEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to Campus Code Labs',
    html: registrationTemplate(user),
  });

export const sendPaymentSuccessEmail = (user, payment, course) =>
  sendEmail({
    to: user.email,
    subject: 'Payment Successful - Campus Code Labs',
    html: paymentSuccessTemplate(user, payment, course),
  });

export const sendOfferLetterEmail = (user, internship, offerLetterUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Your Internship Offer Letter - Campus Code Labs',
    html: offerLetterTemplate(user, internship, offerLetterUrl),
  });

export const sendCompletionEmail = (user, internship) =>
  sendEmail({
    to: user.email,
    subject: 'Internship Completion Confirmed - Campus Code Labs',
    html: completionTemplate(user, internship),
  });

export const sendCertificateEmail = (user, certificate, certificateUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Your Internship Certificate - Campus Code Labs',
    html: certificateTemplate(user, certificate, certificateUrl),
  });

export const sendApplicationReceivedEmail = (applicant, courseName) =>
  sendEmail({
    to: applicant.email,
    subject: 'Application Received - Campus Code Labs',
    html: applicationReceivedTemplate({ ...applicant, applicationId: applicant.applicationId }, courseName),
  });

export const sendPaymentApprovedEmail = (user, course, payment) =>
  sendEmail({
    to: user.email,
    subject: 'Payment Approved - Campus Code Labs',
    html: paymentApprovedTemplate(user, course, payment),
  });

export const sendWelcomeCredentialsEmail = (user, tempPassword) =>
  sendEmail({
    to: user.email,
    subject: 'Your Campus Code Labs Account Credentials',
    html: welcomeCredentialsTemplate(user, tempPassword),
  });

export const sendRecommendationEmail = (user, fileUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Your Recommendation Letter - Campus Code Labs',
    html: recommendationTemplate(user, fileUrl),
  });

export default sendEmail;
