const asyncHandler = require('express-async-handler');
// أعلى ملف wishlist.controller.js
const WishlistService = require("../services/wishlist.service"); 


exports.addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const wishlist = await WishlistService.addToWishlist(userId, productId);

  const io = req.app.get("io");
  io.to(userId.toString()).emit("wishlistUpdated", { wishlist });

  res.status(200).json({ items: wishlist });
});

exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const wishlist = await WishlistService.removeFromWishlist(userId, productId);

  const io = req.app.get("io");
  io.to(userId.toString()).emit("wishlistUpdated", { wishlist });

  res.status(200).json({ items: wishlist });
});

// ✅ Get wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const items = await WishlistService.getWishlist(userId);

  res.status(200).json({ items });
});
