
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs");
const path = require("path");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;        
  const limit = parseInt(req.query.limit) || 10; 
  const skip = (page - 1) * limit;                  

  const totalProducts = await Product.countDocuments();

  const products = await Product.find()
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts,
    products,
  });
});


exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new Error("Product not found");
  res.status(200).json(product);
});


exports.addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;
  if (!name || !price) throw new Error("Name and price are required");

  const newProduct = new Product({ name, description, price, imageUrl, category });
  await newProduct.save();
  res.status(201).json({ msg: "Product added successfully", product: newProduct });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedProduct) throw new Error("Product not found");
  res.json({ msg: "Product updated successfully", product: updatedProduct });
});


exports.deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ msg: "Product not found" });

  if (deleted.imageUrl) {
    const filename = path.basename(deleted.imageUrl); 
    const filePath = path.join(__dirname, "../uploads/", filename);

    fs.unlink(filePath, err => {
      if (err) console.error("Failed to delete image:", err);
      else console.log("Image deleted:", filename);
    });
  }

  res.json({ msg: "Product deleted successfully" });
};