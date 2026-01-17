
const asyncHandler = require("../utils/asyncHandler");
const ProductService = require("../services/product.service");


exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const min = req.query.min ? Number(req.query.min) : undefined;
  const max = req.query.max ? Number(req.query.max) : undefined;
  const data = await ProductService.getAllProducts(page, limit, min, max);

  res.status(200).json(data);
});
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  res.status(200).json(product);
});

exports.addProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.addProduct(req.body);
  res.status(201).json({ msg: "Product added successfully", product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
  res.json({ msg: "Product updated successfully", product: updatedProduct });
});



exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const min = req.query.min;
  const max = req.query.max;

  const data = await ProductService.getProductsByCategory(category, page, limit, min, max);

  res.status(200).json(data);
});


exports.deleteProduct = asyncHandler(async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  res.json({ msg: "Product deleted successfully" });
});
