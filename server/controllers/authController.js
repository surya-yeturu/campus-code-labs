import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Student registration is disabled. Please apply via the internship form.',
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
  if (user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Student login is disabled. Your certificate and offer letter are sent to your email after approval.',
    });
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
