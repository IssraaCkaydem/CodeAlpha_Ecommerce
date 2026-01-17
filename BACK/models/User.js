const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]

});

const User = mongoose.model("User", userSchema);
module.exports = User;
