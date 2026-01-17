
require("dotenv").config({ path: "./secret.env" });

const http = require("http");
const mongoose = require("mongoose");

const app = require("./app"); 

// ===== SOCKET.IO =====
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
global.io = io;

app.set("io", io);

// ===== SOCKET EVENTS =====
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log("👤 User joined room:", userId);
  });
  
  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log("🛠 Admin joined admin-room");
  });
  
  
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

// ===== DATABASE =====
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.mcrtib2.mongodb.net/${dbName}?retryWrites=true&w=majority`
  )
  .then(() => console.log("🍃 MongoDB connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// ===== START SERVER =====
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


