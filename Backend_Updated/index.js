const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const connectToDatabase = require('./conn/connection.js')
const cors = require('cors');
const authRouter = require('./routes/authRoute.js');
const studentRouter = require('./routes/studentRoute.js');
const facultyRouter = require('./routes/facultyRoutes.js');
const adminRouter = require('./routes/adminRoute.js');

require('./cron-schedulers/details-reminder.js');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

connectToDatabase();

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/auth', authRouter);
app.use('/student-info', studentRouter);
app.use('/faculty', facultyRouter);
app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
