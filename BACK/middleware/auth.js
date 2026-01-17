

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(403).json({ expired: true, message: "Access token missing" });
    }

    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    // Token expired or invalid
    return res.status(403).json({ expired: true, message: "Access token expired" });
  }
};

module.exports = authMiddleware;
