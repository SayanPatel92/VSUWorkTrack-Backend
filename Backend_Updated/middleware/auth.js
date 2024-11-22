// /middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log("token",req.headers.authorization)
  let token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
