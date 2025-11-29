
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal, Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const imgSrc = product.imageUrl || product.image || "/fallback.png";

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      const productId = product._id.toString();
      await axiosClient.post("/wishlist/add", { productId }, { withCredentials: true });
      setLiked(true);
      setSnackbar({
        open: true,
        message: `${product.name} added to wishlist!`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to add to wishlist",
        severity: "error",
      });
    }
  };

  const goToDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  return (
    <>
      <div
        className="product-card"
        onClick={() => setOpen(true)}
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: "15px",
          padding: "15px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />

        <FaHeart
          onClick={handleAddToWishlist}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            fontSize: "1.5rem",
            color: liked ? "#ff0000" : "#aaa",
            cursor: "pointer",
          }}
        />

        <h3 style={{ margin: "10px 0 5px" }}>{product.name}</h3>
        <p style={{ fontWeight: "bold", color: "#1e90ff" }}>${product.price}</p>

        {/*  View Details Button  */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToDetails}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(45deg, #1e90ff, #00fa9a, #ffffff)",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#000",
            marginTop: "10px",
          }}
        >
          View Details
        </motion.button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
