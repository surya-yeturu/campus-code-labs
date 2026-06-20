const baseStyle = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f0f4f8; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #0f2744 0%, #1e4a7a 50%, #2563eb 100%); padding: 32px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
  .header p { color: #93c5fd; margin: 8px 0 0; font-size: 14px; }
  .content { padding: 32px; color: #334155; line-height: 1.7; }
  .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
  .footer { background: #0f2744; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px; }
`;

const wrap = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>${baseStyle}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Campus Code Labs</h1>
      <p>THINK. CODE. DELIVER.</p>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Campus Code Labs. All rights reserved.</p>
      <p>Internship Management Platform</p>
    </div>
  </div>
</body>
</html>`;

const applicantName = (user) => user.fullName || user.studentName || 'Student';

export const registrationTemplate = (user) =>
  wrap(`
    <h2>Welcome, ${applicantName(user)}!</h2>
    <p>Your registration at Campus Code Labs was successful.</p>
    <a href="${process.env.CLIENT_URL}/apply" class="btn">Apply for Internship</a>
  `);

export const paymentSuccessTemplate = (user, payment, course) =>
  wrap(`
    <h2>Payment Successful!</h2>
    <p>Hi ${applicantName(user)}, your payment of <strong>Rs. ${payment.amount}</strong> for <strong>${course.title}</strong> has been confirmed.</p>
    <p>Receipt: ${payment.receipt}</p>
    <p>Your internship offer letter and certificate will be emailed after admin verification.</p>
  `);

export const offerLetterTemplate = (user, internship, offerLetterUrl) =>
  wrap(`
    <h2>Internship Offer Letter Issued</h2>
    <p>Dear ${applicantName(user)},</p>
    <p>Congratulations. Your internship application has been approved and your official offer letter has been issued.</p>
    <p><strong>Internship ID:</strong> ${internship.internshipId}</p>
    <p><strong>Duration:</strong> ${internship.duration}<br/>
    <strong>Start Date:</strong> ${new Date(internship.startDate).toLocaleDateString('en-IN')}<br/>
    <strong>End Date:</strong> ${new Date(internship.endDate).toLocaleDateString('en-IN')}</p>
    <p>The signed offer letter PDF is attached to this email for immediate use.</p>
    ${offerLetterUrl ? `<a href="${offerLetterUrl}" class="btn">Open Offer Letter</a>` : ''}
    <p>Regards,<br/>Campus Code Labs Team</p>
  `);

export const completionTemplate = (user, internship) =>
  wrap(`
    <h2>Internship Completion Confirmed</h2>
    <p>Hi ${applicantName(user)}, your internship <strong>${internship.internshipId}</strong> has been completed.</p>
    <p>Your certificate has been emailed to you.</p>
    <a href="${process.env.CLIENT_URL}/verify" class="btn">Verify Certificate</a>
  `);

export const certificateTemplate = (user, certificate, certificateUrl) =>
  wrap(`
    <h2>Internship Completion Certificate</h2>
    <p>Dear ${applicantName(user)},</p>
    <p>Congratulations on successfully completing your internship.</p>
    <p><strong>Program:</strong> ${certificate.courseName}<br/>
    <strong>Certificate No:</strong> ${certificate.certificateNo || certificate.certificateId}<br/>
    <strong>Certificate ID:</strong> ${certificate.certificateId}<br/>
    <strong>Issue Date:</strong> ${new Date(certificate.completionDate).toLocaleDateString('en-IN')}</p>
    <p>Your official certificate PDF is attached to this email.</p>
    <p>You can verify it anytime using the QR code on the certificate or by opening the verification page.</p>
    <a href="${process.env.CLIENT_URL}/verify/${certificate.certificateId}" class="btn">Verify Certificate</a>
    ${certificateUrl ? `<a href="${certificateUrl}" class="btn" style="margin-left:8px;">Open Certificate</a>` : ''}
    <p>We wish you success in your future endeavors.<br/>Campus Code Labs Team</p>
  `);

export const applicationReceivedTemplate = (applicant, courseName) =>
  wrap(`
    <h2>Application Received</h2>
    <p>Hi ${applicant.fullName},</p>
    <p>We have received your application for the <strong>${courseName}</strong> internship program at Campus Code Labs.</p>
    <p>Please complete your payment to proceed with enrollment.</p>
    <a href="${process.env.CLIENT_URL}/apply/payment/${applicant.applicationId || ''}?email=${encodeURIComponent(applicant.email || '')}" class="btn">Complete Payment</a>
  `);

export const paymentApprovedTemplate = (user, course, payment, certificate) =>
  wrap(`
    <h2>Application Approved</h2>
    <p>Hi ${applicantName(user)},</p>
    <p>Your payment of <strong>Rs. ${payment.amount}</strong> for <strong>${course.title}</strong> has been verified and your application is approved.</p>
    <p>Your internship offer letter and certificate have been sent to this email address from Campus Code Labs.</p>
    ${certificate ? `<p>Certificate ID: <strong>${certificate.certificateId}</strong></p>
    <a href="${process.env.CLIENT_URL}/verify/${certificate.certificateId}" class="btn">Verify Certificate</a>` : ''}
  `);

export const welcomeCredentialsTemplate = (user, tempPassword) =>
  wrap(`
    <h2>Welcome to Campus Code Labs</h2>
    <p>Hi ${applicantName(user)},</p>
    <p>Your account credentials:</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Temporary Password:</strong> ${tempPassword}</p>
  `);

export const recommendationTemplate = (user, fileUrl) =>
  wrap(`
    <h2>Your Recommendation Letter</h2>
    <p>Hi ${applicantName(user)},</p>
    <p>Your recommendation letter from Campus Code Labs is ready.</p>
    ${fileUrl ? `<a href="${fileUrl}" class="btn">Download Letter</a>` : ''}
  `);
