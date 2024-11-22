// /controllers/studentProfileController.js
const StudentProfile = require('../models/student-profile.model');
const EmploymentHistory = require('../models/emp-history.model');

// Create or update student profile
exports.createProfile = async (req, res) => {
  const { name, vNumber, degree, major, graduationYear } = req.body;

  try {
    const existingProfile = await StudentProfile.findOne({ user: req.user.id });

    if (existingProfile) {
      // Profile already exists, update it
      existingProfile.name = name;
      // existingProfile.email = email; // Removed
      existingProfile.vNumber = vNumber;
      existingProfile.degree = degree;
      existingProfile.major = major;
      existingProfile.graduationYear = graduationYear;
      // Update the lastUpdatedStatus to current date
      existingProfile.lastDetailsUpdate = new Date();
      await existingProfile.save();
      return res.status(200).json({ message: "Profile updated successfully" });
    } else {
      // Create new profile if no existing profile found
      const profile = new StudentProfile({
        user: req.user.id, // From JWT
        name,
        // email, // Removed
        vNumber,
        degree,
        major,
        graduationYear,
        lastDetailsUpdate: new Date(), // Set the last updated status
      });

      await profile.save();
      return res.status(201).json({ message: "Profile created successfully" });
    }
  } catch (error) {
    console.error("Error in createProfile:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update existing profile
exports.updateProfile = async (req, res) => {
  const { name, phone, degree, major, graduationYear } = req.body;

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },  // Find by current user
      { name, vNumber, degree, major, graduationYear ,lastUpdatedStatus: new Date()},
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add employment/internship history
// Add or Update Employment/Internship History
exports.addEmploymentHistory = async (req, res) => {
  const { _id , company, position, startDate, endDate, description, isInternship } = req.body;
  const employmentId = _id;

  try {
    // Find the student's profile based on the logged-in user
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (employmentId) {
      // Employment ID provided, update specific employment entry
      const empData = await EmploymentHistory.findOne({
        _id: employmentId,
        studentProfile: profile._id,
      });


      if (!empData) {
        return res.status(404).json({ message: "Employment history not found" });
      }

      // Check if the approval status allows modification
      if (empData.approvalStatus === "approved") {
        return res.status(400).json({ message: "Employment data cannot be modified as it's approved" });
      }

      // Update the employment history entry
      empData.company = company;
      empData.position = position;
      empData.startDate = startDate;
      empData.endDate = endDate;
      empData.description = description;
      empData.isInternship = isInternship;
      empData.approvalStatus = "pending";
       // Update lastUpdatedStatus to current date
       empData.lastUpdatedStatus = new Date();

      const EmploymentHistoryResult = await empData.save();
      return res.status(200).json({ message: "Employment history updated successfully", result: EmploymentHistoryResult });
    } else {
      // No employment ID provided, create a new entry
      const newEmploymentHistory = new EmploymentHistory({
        studentProfile: profile._id,
        company,
        position,
        startDate,
        endDate,
        description,
        isInternship,
        approvalStatus: "pending",
        lastUpdatedStatus: new Date(), // Set the lastUpdatedStatus
      });

      await newEmploymentHistory.save();
      return res.status(201).json({ message: "Employment history created successfully" , result: newEmploymentHistory});
    }
  } catch (error) {
    console.error("Error in addEmploymentHistory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Download student data (e.g., CSV or PDF)
exports.getProfile = async (req, res) => {
  try {
      const profile = await StudentProfile.findOne({ user: req.user.id });
      if (!profile) return res.status(200).json({ message: 'No profile Found' });

      const employmentHistory = await EmploymentHistory.find({ studentProfile: profile._id });
      // Format d ata for download (e.g., as CSV or PDF)
      const studentData = {
          profile,
          employmentHistory
      };
      // Example: sending the JSON data for now
      res.json(studentData);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};