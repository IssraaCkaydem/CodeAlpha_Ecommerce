
const User = require("../models/User");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

exports.addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
});

exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();

  res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
});

exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("wishlist"); 
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ items: user.wishlist });
});
