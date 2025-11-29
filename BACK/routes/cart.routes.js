const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth"); 

router.post("/add", authMiddleware, cartController.addToCart);

router.get("/", authMiddleware, cartController.getCart);

router.post("/remove", authMiddleware, cartController.removeFromCart);
router.post("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
