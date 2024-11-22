const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const sendMailUtil = require('../utils/sendMailUtil');
const randomstring = require('randomstring');

// Register User
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "User already exists." });
    }

    const verificationCode = randomstring.generate(10);
    const user = new User({ name, email, password, verificationCode, role });
    user.lastPasswordUpdate = Date.now();
    await user.save();

    await sendMailUtil(email, verificationCode ,"verify");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.json({ message: "Registration successful. Verification email sent.", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.verified && user.role === "Student") {
      return res.status(401).json({ message: "Please verify your email." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { emailToken } = req.query;

  try {
    const user = await User.findOneAndUpdate(
      { verificationCode: emailToken },
      { verified: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token." });
    }

    res.json({ message: "Email verified. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate reset token
    const resetToken = randomstring.generate(32);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
    await user.save();

    // Send email with reset link
  
    await sendMailUtil(user.email, resetToken , "reset");

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    user.password = newPassword; // Will trigger the `pre-save` hook to hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.lastPasswordUpdate = Date.now();

    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
