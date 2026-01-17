

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { withCredentials: true });

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); 

  // real-time socket listener
  useEffect(() => {
    socket.emit("join", "admin-room"); 

    socket.on("newContactMessage", (msg) => {
      setMessages(prev => [msg, ...prev]); 
    });

    return () => {
      socket.off("newContactMessage"); 
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start p-10 bg-gray-100"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        Admin Dashboard
      </h1>

      <motion.div
        className="flex flex-wrap gap-6 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <button
          onClick={() => navigate("/admin/orders")}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Manage Orders
        </button>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Add Product
        </button>

        <button
          onClick={() => navigate("/admin/products")}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Manage Products
        </button>

        <button
          onClick={() => navigate("/admin/contact")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Manage Contacts
        </button>
      </motion.div>

      {messages.length > 0 && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">New Contact Messages</h2>
          <ul className="space-y-4">
            {messages.map(msg => (
              <li key={msg._id} className="p-4 border rounded-lg bg-white shadow-sm">
                <p><strong>Name:</strong> {msg.name}</p>
                <p><strong>Email:</strong> {msg.email}</p>
                <p><strong>Message:</strong> {msg.message}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`ml-2 ${msg.status === "pending" ? "text-yellow-500" : msg.status === "read" ? "text-blue-500" : "text-green-600"}`}>
                    {msg.status.toUpperCase()}
                  </span>
                </p>
                {msg.reply && <p><strong>Admin Reply:</strong> {msg.reply}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
