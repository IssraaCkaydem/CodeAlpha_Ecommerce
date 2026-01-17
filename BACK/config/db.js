// config/db.js
const mongoose = require("mongoose");
require("dotenv").config({ path: "./secret.env" });

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPass}@cluster0.mcrtib2.mongodb.net/${dbName}?retryWrites=true&w=majority`
    );
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
