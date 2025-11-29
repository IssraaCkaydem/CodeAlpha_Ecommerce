import React from "react";
import { motion } from "framer-motion";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";

export default function Home({ setIsAuthenticated }) {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="hero-title">
          Discover the best products at the best prices
        </h1>
        <p className="hero-subtitle">
          Shop now with ease and security
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="shop-button"
        onClick={() => navigate("/products")}
      >
        Shop Now
      </motion.button>

    
    </div>
  );
}
