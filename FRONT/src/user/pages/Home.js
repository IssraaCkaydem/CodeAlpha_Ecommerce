

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-5 bg-gradient-to-br from-blue-500 via-green-400 to-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-3">
          Discover the best products at the best prices
        </h1>
        <p className="text-lg md:text-xl text-white drop-shadow-md mb-8">
          Shop now with ease and security
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/products")}
        className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg md:text-xl py-4 px-10 rounded-full shadow-lg transition-transform"
      >
        Shop Now
      </motion.button>
    </div>
  );
}
