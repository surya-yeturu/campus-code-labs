import nodemailer from "nodemailer";
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
} from "../templates/emailTemplates.js";

const isPlaceholder = (value) =>
  !value || /your_|xxxxx|example\.com|changeme/i.test(String(value));

const getEmailProvider = () => {
  if (process.env.SMTP_USER && !isPlaceholder(process.env.SMTP_USER))
    return "smtp";
  return "mock";
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const getFromAddress = () =>
  process.env.EMAIL_FROM || "Campus Code Labs <no-reply@campuscodelabs.com>";

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const provider = getEmailProvider();
  const from = getFromAddress();

  if (provider === "mock") {
    console.log("\n========== EMAIL (MOCK — not sent) ==========");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(
      "Configure SMTP_USER/SMTP_PASS in server/.env to send real emails.",
    );
    console.log("=============================================\n");
    return { success: true, mock: true };
  }

  try {
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
    subject: "Welcome to Campus Code Labs",
    html: registrationTemplate(user),
  });

export const sendPaymentSuccessEmail = (user, payment, course) =>
  sendEmail({
    to: user.email,
    subject: "Payment Successful - Campus Code Labs",
    html: paymentSuccessTemplate(user, payment, course),
  });

export const sendOfferLetterEmail = (
  user,
  internship,
  offerLetterUrl,
  attachment,
) =>
  sendEmail({
    to: user.email,
    subject: "Your Internship Offer Letter - Campus Code Labs",
    html: offerLetterTemplate(user, internship, offerLetterUrl),
    attachments: attachment
      ? [
          {
            filename: attachment.filename,
            content: attachment.content,
            contentType: "application/pdf",
          },
        ]
      : [],
  });

export const sendCompletionEmail = (user, internship) =>
  sendEmail({
    to: user.email,
    subject: "Internship Completion Confirmed - Campus Code Labs",
    html: completionTemplate(user, internship),
  });

export const sendCertificateEmail = (
  user,
  certificate,
  certificateUrl,
  attachment,
) =>
  sendEmail({
    to: user.email,
    subject: "Your Internship Certificate - Campus Code Labs",
    html: certificateTemplate(user, certificate, certificateUrl),
    attachments: attachment
      ? [
          {
            filename: attachment.filename,
            content: attachment.content,
            contentType: "application/pdf",
          },
        ]
      : [],
  });

export const sendApplicationReceivedEmail = (applicant, courseName) =>
  sendEmail({
    to: applicant.email,
    subject: "Application Received - Campus Code Labs",
    html: applicationReceivedTemplate(
      { ...applicant, applicationId: applicant.applicationId },
      courseName,
    ),
  });

export const sendPaymentApprovedEmail = (user, course, payment, certificate) =>
  sendEmail({
    to: user.email,
    subject: "Application Approved - Campus Code Labs",
    html: paymentApprovedTemplate(user, course, payment, certificate),
  });

export const sendWelcomeCredentialsEmail = (user, tempPassword) =>
  sendEmail({
    to: user.email,
    subject: "Your Campus Code Labs Account Credentials",
    html: welcomeCredentialsTemplate(user, tempPassword),
  });

export const sendRecommendationEmail = (user, fileUrl) =>
  sendEmail({
    to: user.email,
    subject: "Your Recommendation Letter - Campus Code Labs",
    html: recommendationTemplate(user, fileUrl),
  });

export const sendContactMessageEmail = ({ name, email, message }) => {
  const contactEmail = process.env.CONTACT_EMAIL || "campuscodelabs@gmail.com";
  const safeName = escapeHtml(String(name || "").trim());
  const safeEmail = escapeHtml(String(email || "").trim());
  const safeMessage = escapeHtml(String(message || "").trim()).replace(
    /\n/g,
    "<br />",
  );

  return sendEmail({
    to: contactEmail,
    subject: `New contact message from ${safeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="color: #0f2744;">New Contact Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Message:</strong></p>
        <div style="padding: 12px; border-left: 4px solid #1DA1FF; background: #f8fafc;">
          ${safeMessage}
        </div>
      </div>
    `,
  });
};

export default sendEmail;
