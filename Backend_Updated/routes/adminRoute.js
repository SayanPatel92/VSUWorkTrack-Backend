// /routes/faculty.js
const express = require('express');
const protect = require('../middleware/auth');  // JWT auth middleware
const roleCheck = require('../utils/roleCheck'); // Middleware for role checking
const { listUsers, addUser, updateUser, deleteUser} = require('../controllers/adminController');
const router = express.Router();


// Route to get all users
router.get('/users', listUsers);

// Route to add a user
router.post('/add-user', addUser);

// Route to update a user
router.post('/update-user', updateUser);

// Route to delete a user by ID
router.delete('/delete-user/:userId', deleteUser);

module.exports = router;

