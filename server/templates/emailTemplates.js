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
      <h1>Learnovate</h1>
      <p>Innovation Through Learning</p>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Learnovate. All rights reserved.</p>
      <p>Automated Internship Management Platform</p>
    </div>
  </div>
</body>
</html>`;

export const registrationTemplate = (user) =>
  wrap(`
    <h2>Welcome, ${user.fullName}!</h2>
    <p>Your registration at Learnovate was successful. You're now ready to explore industry-ready internships and launch your career.</p>
    <p><strong>What's next?</strong></p>
    <ul>
      <li>Browse our premium internship courses</li>
      <li>Enroll and complete payment</li>
      <li>Receive your offer letter automatically</li>
      <li>Complete your internship and get certified</li>
    </ul>
    <a href="${process.env.CLIENT_URL}/courses" class="btn">Browse Internships</a>
  `);

export const paymentSuccessTemplate = (user, payment, course) =>
  wrap(`
    <h2>Payment Successful!</h2>
    <p>Hi ${user.fullName}, your payment of <strong>₹${payment.amount}</strong> for <strong>${course.title}</strong> has been confirmed.</p>
    <p>Receipt: ${payment.receipt}</p>
    <p>Your internship offer letter is being generated and will be sent to you shortly.</p>
    <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard</a>
  `);

export const offerLetterTemplate = (user, internship, offerLetterUrl) =>
  wrap(`
    <h2>Your Internship Offer Letter</h2>
    <p>Congratulations ${user.fullName}!</p>
    <p>Your offer letter for internship <strong>${internship.internshipId}</strong> is ready.</p>
    <p>Duration: ${internship.duration} | Start: ${new Date(internship.startDate).toLocaleDateString()}</p>
    <a href="${offerLetterUrl}" class="btn">Download Offer Letter</a>
    <a href="${process.env.CLIENT_URL}/dashboard/internships" class="btn" style="margin-left:8px">View Dashboard</a>
  `);

export const completionTemplate = (user, internship) =>
  wrap(`
    <h2>Internship Completion Confirmed</h2>
    <p>Hi ${user.fullName}, your completion form for internship <strong>${internship.internshipId}</strong> has been received.</p>
    <p>Your certificate is being generated and will be emailed to you automatically.</p>
    <a href="${process.env.CLIENT_URL}/dashboard/certificates" class="btn">View Certificates</a>
  `);

export const certificateTemplate = (user, certificate, certificateUrl) =>
  wrap(`
    <h2>Your Internship Certificate</h2>
    <p>Congratulations ${user.fullName}!</p>
    <p>You have successfully completed <strong>${certificate.courseName}</strong>.</p>
    <p>Certificate ID: <strong>${certificate.certificateId}</strong></p>
    <p>Verify anytime at: ${process.env.CLIENT_URL}/verify/${certificate.certificateId}</p>
    <a href="${certificateUrl}" class="btn">Download Certificate</a>
  `);

export const applicationReceivedTemplate = (applicant, courseName) =>
  wrap(`
    <h2>Application Received</h2>
    <p>Hi ${applicant.fullName},</p>
    <p>We have received your application for the <strong>${courseName}</strong> internship program at Campus Code Labs.</p>
    <p>Please complete your payment to proceed with enrollment.</p>
    <a href="${process.env.CLIENT_URL}/apply/payment/${applicant.applicationId || ''}" class="btn">Complete Payment</a>
  `);

export const paymentApprovedTemplate = (user, course, payment) =>
  wrap(`
    <h2>Payment Approved</h2>
    <p>Hi ${user.fullName},</p>
    <p>Your payment of <strong>₹${payment.amount}</strong> for <strong>${course.title}</strong> has been verified.</p>
    <p>Your internship enrollment is now active. Login to your dashboard to access learning materials.</p>
    <a href="${process.env.CLIENT_URL}/login" class="btn">Student Login</a>
  `);

export const welcomeCredentialsTemplate = (user, tempPassword) =>
  wrap(`
    <h2>Welcome to Campus Code Labs</h2>
    <p>Hi ${user.fullName},</p>
    <p>Your student account has been created. Use the credentials below to login:</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Temporary Password:</strong> ${tempPassword}</p>
    <p>Please change your password after logging in.</p>
    <a href="${process.env.CLIENT_URL}/login" class="btn">Login to Dashboard</a>
  `);

export const recommendationTemplate = (user, fileUrl) =>
  wrap(`
    <h2>Your Recommendation Letter</h2>
    <p>Hi ${user.fullName},</p>
    <p>Your recommendation letter from Campus Code Labs is ready.</p>
    ${fileUrl ? `<a href="${fileUrl}" class="btn">Download Letter</a>` : '<p>Login to your dashboard to download.</p>'}
    <a href="${process.env.CLIENT_URL}/dashboard/documents" class="btn">View Documents</a>
  `);
