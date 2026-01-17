

const asyncHandler = require("../utils/asyncHandler");
const AuthService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const isProduction = false;  

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};


// ===== REGISTER =====
exports.registerUser = asyncHandler(async (req, res) => {
  const { newUser, accessToken, refreshToken } = await AuthService.register(req.body);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).json({
    success: true,
    message: "User registered",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
      accessToken,
  refreshToken
  });
});

// ===== LOGIN =====
exports.loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
      accessToken,
  refreshToken
  });

});

// ===== CHECK AUTH =====
exports.checkAuth = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.json({ authenticated: false, needRefresh: true });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    return res.json({ authenticated: true, user });
  } catch {
    return res.json({ authenticated: false, needRefresh: true });
  }
});


// ===== REFRESH TOKEN =====
exports.refreshToken = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken)
    return res.status(401).json({ message: "No refresh token" });

  const { accessToken, refreshToken } =
    await AuthService.refreshToken(oldRefreshToken);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password -refreshToken");

  res.json({ success: true, user });
});


// ===== LOGOUT =====
exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", { ...cookieOptions });
  res.clearCookie("refreshToken", { ...cookieOptions });

  res.json({ message: "Logged out" });
});
