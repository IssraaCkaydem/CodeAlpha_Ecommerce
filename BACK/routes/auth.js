const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { validate } = require("../middleware/validate");

const { registerValidation, loginValidation } = require("../middleware/validation");


// Register
router.post("/register", registerValidation, validate,  authController.registerUser);

// Login
router.post("/login", loginValidation, validate,  authController.loginUser);

// Check auth
router.get("/check", authController.checkAuth);

// Logout
router.post("/logout", authController.logoutUser);

// Refresh token
router.post("/refresh", authController.refreshToken);

module.exports = router;
