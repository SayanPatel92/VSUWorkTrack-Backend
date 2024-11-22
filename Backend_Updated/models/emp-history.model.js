// /models/EmploymentHistory.js
const mongoose = require('mongoose');

const EmploymentHistorySchema = new mongoose.Schema({
  studentProfile: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile', 
    required: true 
  }, // Reference to the StudentProfile
  company: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date 
  },
  description: { 
    type: String 
  },
  isInternship: { 
    type: Boolean, 
    default: false 
  },
  lastDetailsUpdate: { type: Date, default: Date.now },
   // Add a new field for approval status
   approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'declined'], // Allowed values for approval
    default: 'pending',
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmploymentHistory', EmploymentHistorySchema);
