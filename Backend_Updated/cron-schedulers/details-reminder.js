const cron = require('node-cron');
const StudentProfile = require('../models/student-profile.model');
const User = require('../models/user.model');
const nodemailer = require('nodemailer');
const SendReminderEmail = async (email, emailSubject, emailText) => {
    try {
        // Create a test account asynchronously using await
        let testAccount = await nodemailer.createTestAccount();
        console.log(testAccount); // Log the test account credentials for debugging

        // Nodemailer setup for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Gmail App Password
            },
        });

        // Function to send email reminder (for example)
        const mailOptions = {
            from: testAccount.user, // From the test account
            to: email,
            subject: emailSubject,
            text: emailText,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log('Email sent:', info.response);
                console.log('Preview URL:', nodemailer.getTestMessageUrl(info)); // Preview link for Ethereal
            }
        });
        // Call the sendEmail function or handle other logic as needed
        // Example: await sendEmail('recipient@example.com', 'Subject', 'Email Body');

    } catch (error) {
        console.error('Error in creating test account or sending email:', error);
    }
};


// Cron job to send password update reminders every 1st of the month
cron.schedule('0 0 1 * *', async () => {
    try {
        // Find all students who need a reminder to update their password
        const students = await User.find({ role: 'Student' });

        for (const student of students) {
            const profile = await StudentProfile.findOne({ user: student._id });

            if (profile) {
                // Check if lastUpdatedStatus is more than 1 month ago
                const lastUpdatedDate = profile.lastUpdatedStatus;
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Set to one month ago

                // If the profile was last updated more than a month ago, send reminder
                if (!lastUpdatedDate || new Date(lastUpdatedDate) < oneMonthAgo) {
                    const emailSubject = 'Reminder to Update Your Password';
                    const emailText = `Dear ${student.name},\n\nIt's been a month since your last password update. Please update your password to ensure the security of your account.\n\nThank you.`;

                    // Send reminder email
                    await SendReminderEmail(student.email, emailSubject, emailText);

                    console.log(`Reminder to update password sent to: ${student.email}`);
                }
            }
        }
    } catch (error) {
        console.error('Error in monthly password update reminder:', error);
    }
});

// Cron job to remind students to update profile every 6 months
cron.schedule('0 0 1 1,7 *', async () => {
    try {
        // Find all students whose profiles need to be updated
        const students = await User.find({ role: 'Student' });

        for (const student of students) {
            const profile = await StudentProfile.findOne({ user: student._id });

            if (profile) {
                // Check if lastUpdatedStatus is more than 6 months ago
                const lastUpdatedDate = profile.lastUpdatedStatus;
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Set to six months ago

                // If profile last updated more than 6 months ago, send reminder
                if (!lastUpdatedDate || new Date(lastUpdatedDate) < sixMonthsAgo) {
                    const emailSubject = 'Reminder to Update Your Profile';
                    const emailText = `Dear ${student.name},\n\nIt's been 6 months since your last profile update. Please log in to your account and update your profile details to ensure your information is current.\n\nThank you.`;

                    // Send reminder email
                    await SendReminderEmail(student.email, emailSubject, emailText);

                    console.log(`Student details update reminder sent to: ${student.email}`);
                }
            }
        }
    } catch (error) {
        console.error('Error in six-monthly student details update:', error);
    }
});
