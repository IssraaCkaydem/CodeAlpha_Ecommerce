
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: "./secret.env" });

// ===== MIDDLEWARE =====
app.set("trust proxy", 1);
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ===== STATIC FILES =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== ROUTES =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/upload"));
const contactRoutes = require("./routes/contact.routes");
app.use("/api/contact", contactRoutes);


// ===== ERROR HANDLER =====
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
