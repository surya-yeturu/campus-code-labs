import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendRegistrationEmail } from '../services/emailService.js';

export const register = async (req, res) => {
  const { fullName, email, phone, collegeName, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  const user = await User.create({ fullName, email, phone, collegeName, password });
  sendRegistrationEmail(user).catch(console.error);
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      collegeName: user.collegeName,
      role: user.role,
      token: generateToken(user._id),
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Account deactivated' });
  }
  res.json({
    success: true,
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      collegeName: user.collegeName,
      role: user.role,
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id),
    },
  });
};

export const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { fullName, phone, collegeName, profilePhoto } = req.body;
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (collegeName) user.collegeName = collegeName;
  if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  res.json({ success: true, data: user });
};
