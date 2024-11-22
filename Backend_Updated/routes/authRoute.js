// /routes/auth.js
const express = require('express');
const { register, login , verifyEmail ,forgotPassword, resetPassword} = require('../controllers/authController');
const router = express.Router();

router.post('/register', register); // For Students
router.post('/login', login); // Login for all
router.get('/verify-email', verifyEmail); // Login for all
// Forgot Password
router.post('/forgot-password', forgotPassword);
// Reset Password
router.post('/reset-password', resetPassword);
module.exports = router;
