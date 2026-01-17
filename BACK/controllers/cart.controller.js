



const asyncHandler = require('../utils/asyncHandler');
const CartService = require('../services/cart.service');

exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  const cart = await CartService.addToCart(userId, productId, quantity);

  const io = req.app.get("io");
  io.to(userId.toString()).emit("cartUpdated", { cart });

  res.status(200).json({ message: "Product added to cart", cart });
});


exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const cart = await CartService.removeFromCart(userId, productId);

  // 🔴 Real-time update
  const io = req.app.get("io");
 // io.emit("cartUpdated", { userId, cart });
 io.to(userId.toString()).emit("cartUpdated", { cart });


  res.status(200).json({ message: "Product removed from cart", cart });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await CartService.clearCart(userId);

  // 🔴 Real-time update
  const io = req.app.get("io");
io.to(userId.toString()).emit("cartUpdated", { cart });


  res.status(200).json({ message: "Cart cleared", cart });
});

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cartData = await CartService.getCart(userId);
  res.status(200).json(cartData);
});
