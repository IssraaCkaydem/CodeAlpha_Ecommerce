
const asyncHandler = require("../utils/asyncHandler");
const ProductSearchService = require("../services/productSearch.service");

// GET /api/search?q=keyword
exports.searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const results = await ProductSearchService.searchProducts(q);

  res.status(200).json(results);
});

