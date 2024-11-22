// app.get('/verify/:verificationCode', async (req, res) => {
//     const { verificationCode } = req.params;

//     // Find user by verification code
//     const user = await User.findOne({ verificationCode });
//     if (!user) {
//         return res.status(400).json({ error: 'Invalid verification code' });
//     }

//     // Mark user as verified
//     user.verified = true;
//     await user.save();

//     res.status(200).json({ message: 'Email verified successfully' });
// });