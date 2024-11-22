// /routes/faculty.js
const express = require('express');
const protect = require('../middleware/auth');  // JWT auth middleware
const roleCheck = require('../utils/roleCheck'); // Middleware for role checking
const { fetchStudentsWithEmployment,filterStudentProfiles, fetchStudentsWithPenDecStatus,getAllStudentProfiles, getStudentProfileById, downloadStudentData , approveOrDeclineStudentDataRequest} = require('../controllers/facultyController');
const router = express.Router();
// Faculty can get all student profiles
// router.get('/students', protect, roleCheck(['Faculty', 'Admin']), fetchStudentsWithEmployment);  // GET /api/faculty/students
router.get('/students', protect, roleCheck(['Faculty', 'Admin']), getAllStudentProfiles);  // GET /api/faculty/students

router.get('/students-emp-status', protect, roleCheck(['Faculty', 'Admin']), fetchStudentsWithPenDecStatus);  // GET /api/faculty/students

// Faculty can view a single student's profile by ID
router.get('/students/:id', protect, roleCheck(['Faculty', 'Admin']), getStudentProfileById);  // GET /api/faculty/students/:id

// Faculty can download student data in a structured format (e.g., CSV, PDF)
router.get('/students/:id/download', protect, roleCheck(['Faculty', 'Admin']), downloadStudentData);  // GET /api/faculty/students/:id/download

// To approve or decline the request
router.put('/employment/:s_id/request-confirmation', protect, roleCheck(['Faculty', 'Admin']), approveOrDeclineStudentDataRequest);

router.get('/students-filter',  protect, roleCheck(['Faculty', 'Admin']),filterStudentProfiles);

module.exports = router;
