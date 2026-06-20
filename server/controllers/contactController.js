import { sendContactMessageEmail } from '../services/emailService.js';

export const submitContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  await sendContactMessageEmail({ name, email, message });

  res.json({
    success: true,
    message: 'Message sent successfully',
  });
};
