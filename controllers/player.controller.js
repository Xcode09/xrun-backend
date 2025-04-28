const { User } = require('../models');
const { comparePassword, hashPassword } = require('../utils/auth.js');

// 👤 Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      status: 0,
      message: "User Fetch",
      data:user
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ Edit Profile
exports.editProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, mobile, country, clubName, pictureUrl } = req.body;
    await req.user.update({ firstName, lastName, mobile, country, clubName, pictureUrl });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

// 🔒 Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    const newHashed = await hashPassword(newPassword);
    await user.update({ passwordHash: newHashed });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// ❌ Delete Account
exports.deleteAccount = async (req, res, next) => {
  try {
    await req.user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
