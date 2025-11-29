
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/search?q=keyword
exports.searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]); 

  const regex = new RegExp(q, "i"); // case-insensitive
  const results = await Product.find({
    $or: [{ name: regex }, { category: regex }],
  });

  res.json(results);
});

