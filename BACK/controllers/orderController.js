
const asyncHandler = require("../utils/asyncHandler");
const OrderService = require("../services/order.service");

exports.confirmOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const order = await OrderService.confirmOrder(userId, req.body);

  res.status(201).json({
    success: true,
    msg: "Order confirmed successfully",
    order,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderService.getAllOrders();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const updatedOrder = await OrderService.updateOrderStatus(orderId, status);

  // Send socket event
  const io = req.app.get("io");
  io.emit("orderUpdated", updatedOrder);

  res.status(200).json({
    success: true,
    msg: "Order status updated",
    order: updatedOrder,
  });
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await OrderService.getUserOrders(userId);

  res.status(200).json({
    success: true,
    orders,
  });
});
