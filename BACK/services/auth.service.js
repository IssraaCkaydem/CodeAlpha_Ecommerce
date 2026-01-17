
const User = require("../models/User");
const { generateToken, verifyToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/hash");

class AuthService {

  static async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateToken({ id: newUser._id, role: newUser.role }, "15m");
    const refreshToken = generateToken({ id: newUser._id }, "30d");

    newUser.refreshToken = refreshToken;
    await newUser.save();

    newUser.password = undefined;
    newUser.refreshToken = undefined;

    return { newUser, accessToken, refreshToken };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const accessToken = generateToken({ id: user._id, role: user.role }, "15m");
    const refreshToken = generateToken({ id: user._id }, "30d");

    user.refreshToken = refreshToken;
    await user.save();

    user.password = undefined;
    user.refreshToken = undefined;

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) throw new Error("No refresh token provided");

    const decoded = verifyToken(oldRefreshToken);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== oldRefreshToken)
      throw new Error("Invalid refresh token");

    const accessToken = generateToken({ id: user._id, role: user.role }, "15m");
    const refreshToken = generateToken({ id: user._id }, "30d");

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }
}

module.exports = AuthService;
