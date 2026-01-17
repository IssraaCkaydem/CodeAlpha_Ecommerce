const bcrypt = require("bcryptjs");

// Hash a password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); 
};

// Compare password with hashed password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
