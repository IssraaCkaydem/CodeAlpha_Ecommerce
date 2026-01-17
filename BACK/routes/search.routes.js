const express = require("express");
const router = express.Router();
const searchController = require("../controllers/productSearch.controller");

router.get("/", searchController.searchProducts);

module.exports = router;
