const express = require('express');
const protect = require('../middleware/auth'); // JWT auth middleware
const roleCheck = require('../utils/roleCheck'); // Middleware for role checking

const { createProfile,getProfile, updateProfile, addEmploymentHistory } = require('../controllers/studentProfileController');
const router = express.Router();

// Create or update student profile
router.post('/profile', protect,  createProfile);  // POST /api/student/profile
router.put('/profile', protect, updateProfile);   // PUT /api/student/profile
router.get('/profile', protect, getProfile);   // PUT /api/student/profile

// Add employment or internship history
router.post('/employment',protect , addEmploymentHistory); // POST /api/student/employment

module.exports = router;
