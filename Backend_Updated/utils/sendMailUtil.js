const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

const sendMailUtil = async (email, token, type) => {
    // Configure the transporter with Gmail credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS, // Your Gmail App Password
        },
    });

    // Define the email options
    let mailOptions = {};

    if (type === "verify") {
        const verificationLink = `http://localhost:3000/auth/verify-email?emailToken=${token}`;
        mailOptions = {
            from: `"VSUWORKTRACK" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Email Verification - University Portal',
            html: `
                <p>Hello,</p>
                <p>Please kindly verify your email address by clicking on the link below:</p>
                <a href="${verificationLink}">Click here to verify</a>
            `,
        };
    } else if (type === "reset") {
        // **Updated reset link to remove '?'**
        const resetLink = `http://localhost:3001/reset-password/emailToken=${token}`;
        mailOptions = {
            from: `"VSUWORKTRACK" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your Password - University Portal',
            html: `
                <p>Hello,</p>
                <p>Please reset your password by clicking on the link below:</p>
                <a href="${resetLink}">Click here to reset</a>
            `,
        };
    } else {
        console.log("Invalid email type specified.");
        return;
    }

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');
    } catch (error) {
        console.log("Error sending email:", error);
    }
};

module.exports = sendMailUtil;
