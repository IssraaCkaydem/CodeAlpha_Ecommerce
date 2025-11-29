const express = require("express");
const router = express.Router();
const { confirmOrder, getAllOrders,updateOrderStatus,getUserOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");


router.post("/confirm", authMiddleware, confirmOrder);
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);

router.put("/update-status/:id", authMiddleware, adminMiddleware, updateOrderStatus);
router.get("/my-orders", authMiddleware, getUserOrders);


module.exports = router;
