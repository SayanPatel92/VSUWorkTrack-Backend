// /models/StudentProfile.js
const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User model (Student)
  name: { 
    type: String, 
    required: true 
  },
  vNumber: { 
    type: String 
  },
  degree: { 
    type: String 
  },
  major: { 
    type: String 
  },
  graduationYear: { 
    type: Number 
  },
  lastDetailsUpdate: { type: Date, default: Date.now },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
