
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }

  const savedCart = await cart.save();
  res.status(200).json({ message: "Product added to cart", cart: savedCart });
});

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) return res.status(200).json({ items: [], total: 0 });

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  res.status(200).json({ items: cart.items, total });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();

  res.status(200).json({ message: "Product removed from cart", cart });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = [];
  await cart.save();

  res.status(200).json({ message: "Cart cleared", cart });
});
