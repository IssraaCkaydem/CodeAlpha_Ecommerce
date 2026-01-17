const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

class ProductService {

static async getAllProducts(page = 1, limit = 10, min, max) {
  const skip = (page - 1) * limit;

  const query = {};

  if (min !== undefined || max !== undefined) {
    query.price = {};
    if (min !== undefined) query.price.$gte = min;
    if (max !== undefined) query.price.$lte = max;
  }

  const products = await Product.find(query)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

  static async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  static async addProduct({ name, description, price, imageUrl, category }) {
    if (!name || !price) throw new Error("Name and price are required");

    const newProduct = new Product({ name, description, price, imageUrl, category });
    return await newProduct.save();
  }

  static async updateProduct(id, updateData) {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) throw new Error("Product not found");
    return updatedProduct;
  }

  static async deleteProduct(id) {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw new Error("Product not found");

    if (deleted.imageUrl) {
      const filename = path.basename(deleted.imageUrl);
      const filePath = path.join(__dirname, "../uploads/", filename);

      fs.unlink(filePath, err => {
        if (err) console.error("Failed to delete image:", err);
        else console.log("Image deleted:", filename);
      });
    }

    return deleted;
  }

static async getProductsByCategory(category, page = 1, limit = 10, min, max) {
  const skip = (page - 1) * limit;

  let query = {};
  if (category.toLowerCase() !== "all") {
    query.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (min) query.price = { ...query.price, $gte: parseFloat(min) };
  if (max) query.price = { ...query.price, $lte: parseFloat(max) };

  const products = await Product.find(query).skip(skip).limit(limit);
  const total = await Product.countDocuments(query);

  return { products, total, page, pages: Math.ceil(total / limit) };
}


}

module.exports = ProductService;
