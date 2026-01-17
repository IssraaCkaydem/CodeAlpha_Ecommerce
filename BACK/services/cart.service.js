// services/cart.service.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {

  static async addToCart(userId, productId, quantity) {
    if (!productId) throw new Error("Product ID is required");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    return await cart.save();
  }

  static async getCart(userId) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return { items: [], total: 0 };

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { items: cart.items, total };
  }

  static async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    return await cart.save();
  }

  static async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = [];
    return await cart.save();
  }
}

module.exports = CartService;
