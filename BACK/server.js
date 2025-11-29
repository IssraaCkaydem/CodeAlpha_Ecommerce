
const express = require("express");
const app = express();
console.log("Server file loaded");

// ===== Middleware =====
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

// ===== Database =====
const mongoose = require("mongoose");
require("dotenv").config({ path: "./secret.env" });

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.mcrtib2.mongodb.net/${dbName}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected successfully"))
  .catch((error) => console.log("Error with connection", error));

// ===== Routes =====
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const searchRoutes = require("./routes/search.routes");
app.use("/api/search", searchRoutes);

const cartRoutes = require("./routes/cart.routes");
app.use("/api/cart", cartRoutes);

const wishlistRoutes = require("./routes/wishlist.routes");
app.use("/api/wishlist", wishlistRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// ===== Server + Socket.IO =====
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

app.set("io", io);

// ===== Start Server =====
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadRoute = require("./routes/upload");
app.use("/api/upload", uploadRoute);

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
