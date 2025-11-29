const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const wishlistController = require("../controllers/wishlist.controller");

router.post("/add", authMiddleware, wishlistController.addToWishlist);

router.post("/remove", authMiddleware, wishlistController.removeFromWishlist);

router.get("/", authMiddleware, wishlistController.getWishlist);

module.exports = router;
