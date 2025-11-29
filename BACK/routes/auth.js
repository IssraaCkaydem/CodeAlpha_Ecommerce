const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { registerValidation, loginValidation } = require("../middleware/validation");
const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

// Register
router.post("/register", registerValidation, handleValidationErrors, authController.registerUser);

// Login
router.post("/login", loginValidation, handleValidationErrors, authController.loginUser);

// Check auth
router.get("/check", authController.checkAuth);

// Logout
router.post("/logout", authController.logoutUser);

module.exports = router;
