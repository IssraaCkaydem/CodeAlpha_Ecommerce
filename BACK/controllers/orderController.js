
const Order = require("../models/Order");
const Cart = require("../models/Cart"); // لو عندك موديل الكارت
const asyncHandler = require("../utils/asyncHandler");

exports.confirmOrder = asyncHandler(async (req, res) => {
  const { name, phone, address, items } = req.body;

  // Validate fields
  if (!name || !phone || !address || !items) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: "Cart is empty" });
  }

  for (let item of items) {
    if (!item.product || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({ msg: "Invalid items in cart" });
    }
  }

  const phoneRegex = /^[0-9]{8,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ msg: "Invalid phone number" });
  }

  const newOrder = new Order({
    user: req.user.id,
    name,
    phone,
    address,
    items,
    status: "pending",
    createdAt: new Date(),
  });

  await newOrder.save();

  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

  res.status(201).json({
    success: true,
    msg: "Order confirmed successfully",
    order: newOrder,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "processing", "shipped", "delivered"];
  if (!allowed.includes(status)) return res.status(400).json({ msg: "Invalid status" });

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  const io = req.app.get("io");
  io.emit("orderUpdated", updatedOrder);

  res.status(200).json({
    success: true,
    msg: "Order status updated",
    order: updatedOrder,
  });
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});
