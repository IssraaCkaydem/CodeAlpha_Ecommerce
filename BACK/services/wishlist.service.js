const User = require("../models/User");

class WishlistService {

  // Add product to user's wishlist
  static async addToWishlist(userId, productId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    await user.populate("wishlist");


    return user.wishlist;
  }

  // Remove product from user's wishlist
  static async removeFromWishlist(userId, productId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    await user.populate("wishlist");

    return user.wishlist;
  }


 

  // Get all products in user's wishlist
  static async getWishlist(userId) {
    const user = await User.findById(userId).populate("wishlist");
    if (!user) throw new Error("User not found");

    return user.wishlist;

  }
}

module.exports = WishlistService;
