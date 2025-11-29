const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

// GET /api/search?q=keyword
router.get("/", searchController.searchProducts);

module.exports = router;
