const { body } = require("express-validator");

exports.productValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters long"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number")
    .custom(value => value > 0).withMessage("Price must be greater than 0"),

  body("category")
    .notEmpty().withMessage("Category is required"),

  body("imageUrl")
    .optional() // مش بنستخدم isURL() لو رفع الصورة local
];