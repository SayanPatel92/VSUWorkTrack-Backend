const User = require('../models/user.model');
const sendMailUtil = require('../utils/sendMailUtil');
const randomstring = require('randomstring')
const bcryptjs = require('bcryptjs');

// Controller to list all users
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Controller to add a new user
exports.addUser = async (req, res) => {
    const { email, password, role , name} = req.body;
    const verificationCode = randomstring.generate(10);
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ message: "User exists Already" });
        }
        const user = new User({ name, email, password, verificationCode, role , verified: true});
        await user.save();
        res.status(200).json({ message: "User added successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error adding user" });
    }
};

// Controller to update an existing user
exports.updateUser = async (req, res) => {
    const { previousEmail, email, password, role } = req.body;
    try {
        // Find the user by previous email and update their details
        const user = await User.findOneAndUpdate(
            { email: previousEmail },  // Search condition using previous email
            { email, password, role },  // Fields to update
            { new: true }               // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Error updating user" });
    }
};


// Controller to delete a user by ID
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user" });
    }
};