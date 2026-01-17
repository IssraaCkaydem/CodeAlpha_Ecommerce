const Order = require("../models/Order");
const Cart = require("../models/Cart");

class OrderService {
  // ✔ Confirm order
  static async confirmOrder(userId, { name, phone, address, items }) {
    if (!name || !phone || !address || !items) {
      throw new Error("Missing required fields");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (let item of items) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid items in cart");
      }
    }

    // Validate phone
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Invalid phone number");
    }

    // Create order
    const newOrder = await Order.create({
      user: userId,
      name,
      phone,
      address,
      items,
      status: "pending",
      createdAt: new Date(),
    });

    // Empty cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    return newOrder;
  }

  // ✔ Get all orders
  static async getAllOrders() {
    return await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  // ✔ Update order status
  static async updateOrderStatus(orderId, status) {
    const allowed = ["pending", "processing", "shipped", "delivered"];
    if (!allowed.includes(status)) throw new Error("Invalid status");

    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  // ✔ Get orders for a specific user
  /*
  static async getUserOrders(userId) {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }*/
 
  // ✔ Get orders for a specific user
// OrderService.js
static async getUserOrders(userId) {
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price imageUrl"); // <-- هالشي اللي ناقص
}


}

module.exports = OrderService;
