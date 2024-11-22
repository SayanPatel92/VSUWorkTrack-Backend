const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: String, required: true },
  verified: { type: Boolean, default: false },
  department: {
    type: String,
    required: function() { return this.role === 'Admin'; }, // Required only for Admin
  },
  role: { type: String, enum: ['Student', 'Faculty', 'Admin'], required: true },
  resetPasswordToken: { type: String }, // Token for password reset
  resetPasswordExpires: { type: Date }, // Expiry for reset token
  lastPasswordUpdate: { type: Date, default: Date.now },

});


// Hash password before saving user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
