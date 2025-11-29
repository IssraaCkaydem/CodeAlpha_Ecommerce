const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only images are allowed (jpeg, jpg, png)"));
  }
});

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  console.log("Uploaded Image URL:", imageUrl);

  res.json({ url: imageUrl });
});

module.exports = router;

