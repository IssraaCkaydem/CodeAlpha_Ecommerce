
const express = require("express");
const router = express.Router();

const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct,getProductsByCategory} = require("../controllers/productController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminMiddleware");
const { productValidation } = require("../middleware/productValidation");
const { validate } = require("../middleware/validate");
// GET all products (public)
router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", auth, adminOnly, productValidation, validate, addProduct);


router.put("/:id", auth, adminOnly , updateProduct);
router.delete("/:id", auth, adminOnly , deleteProduct);
router.get("/category/:category", getProductsByCategory);

module.exports = router;

