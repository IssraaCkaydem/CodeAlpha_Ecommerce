const Product = require("../models/Product");

class ProductSearchService {
  static async searchProducts(query) {
    if (!query) return [];

    const regex = new RegExp(query, "i"); // case-insensitive search
    return await Product.find({
      $or: [{ name: regex }, { category: regex }],
    });
  }
}

module.exports = ProductSearchService;
