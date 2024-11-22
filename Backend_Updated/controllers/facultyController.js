const StudentProfile = require('../models/student-profile.model');
const EmploymentHistory = require('../models/emp-history.model');


/* Get all student profiles (for faculty) */
exports.getAllStudentProfiles = async (req, res) => {
    try {
        const profiles = await StudentProfile.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.fetchStudentsWithEmployment = async (req, res) => {
    try {
        const allStudents = await StudentProfile.find();


        const studentsWithEmployment = await Promise.all(allStudents.map(async (student) => {
            const employmentHistory = await EmploymentHistory.find({ studentProfile: student._id });
            return {
                ...student._doc,
                employmentHistory
            };
        }));

        res.json({ studentsWithEmployment });
    } catch (error) {
        console.error("Error fetching students and employment history:", error);
        res.status(500).json({ message: error.message }); // Re-throw the error to handle it at a higher level
    }
}



exports.fetchStudentsWithPenDecStatus = async (req, res) => {
    try {
        // Fetch all students
        const allStudents = await StudentProfile.find();

        // Fetch employment history for each student
        const studentsWithEmployment = await Promise.all(
            allStudents.map(async (student) => {
                const employmentHistory = await EmploymentHistory.find({
                    studentProfile: student._id,
                });

                // Filter employment history to only include pending or declined statuses
                const filteredEmploymentHistory = employmentHistory.filter(
                    (history) => history.approvalStatus === "pending" || history.approvalStatus === "declined"
                );

                return {
                    student,
                    employmentHistory: filteredEmploymentHistory, // Only return the filtered history
                };
            })
        );

        // Send the filtered data back to the client
        res.json({ filteredStudents: studentsWithEmployment });
    } catch (error) {
        console.error("Error fetching students and employment history:", error);
        res.status(500).json({ message: error.message });
    }
};

/* Gt a specific student profile by ID */
exports.getStudentProfileById = async (req, res) => {
    try {
        const profile = await StudentProfile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Student not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Download student data (e.g., CSV or PDF)
exports.downloadStudentData = async (req, res) => {
    try {
        const profile = await StudentProfile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Student not found' });

        const employmentHistory = await EmploymentHistory.find({ studentProfile: profile._id });

        // Format data for download (e.g., as CSV or PDF)
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



exports.approveOrDeclineStudentDataRequest = async (req, res) => {
    try {
        const { s_id } = req.params;
        const { action } = req.body;

        // // Validate action (should be either 'approve' or 'decline')
        // if (!['approve', 'decline'].includes(action)) {
        //     return res.status(400).json({ message: 'Invalid action' });
        // }

        // Find the student profile by ID
        // const profile = await StudentProfile.findById(req.params.s_id);
        // if (!profile) return res.status(404).json({ message: 'Student not found' });

        const employmentHistory = await EmploymentHistory.findById(s_id);
        // Update the approval status based on the action
        employmentHistory.approvalStatus = action;

        await employmentHistory.save();

        // Notify the student about the decision (e.g., email, notification)

        res.status(200).json({ message: 'Student data request updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.filterStudentProfiles = async (req, res) => {
    try {
        const { query, filter } = req.query;

        // Validate that both query and filter are provided
        if (!query || !filter) {
            return res.status(400).json({ message: "Both query and filter parameters are required." });
        }

        // Create dynamic filter criteria
        const filterParams = { [filter]: { $regex: query, $options: 'i' } }; // Case-insensitive partial match

        // Find matching student profiles based on the dynamic filter criteria
        const profiles = await StudentProfile.find(filterParams);

        // Populate employment history for each profile if needed
        const profilesWithEmploymentHistory = await Promise.all(profiles.map(async (profile) => {
            const employmentHistory = await EmploymentHistory.find({ studentProfile: profile._id });
            return {
                ...profile._doc,
                employmentHistory
            };
        }));

        res.json(profilesWithEmploymentHistory);
    } catch (error) {
        console.error("Error filtering student profiles:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
