
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Snackbar, Alert } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../services/wishlistService";

export default function ProductCard({ product }) {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const imgSrc = product.imageUrl || product.image || "/fallback.png";

  useEffect(() => {
    if (!user) return; 

    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        const ids = res.items.map((item) => item._id);
        setWishlistItems(ids);
      } catch (err) {
        console.error("Error fetching wishlist");
      }
    };

    fetchWishlist();
  }, [user]);

  const isLiked = user && wishlistItems.includes(product._id);

  // ===== toggle wishlist
  const handleToggleWishlist = async (e) => {
    e.stopPropagation();

    // 🚨 Guest → Login
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (!isLiked) {
        await addToWishlist(product._id);
        setWishlistItems((prev) => [...prev, product._id]);
        setSnackbar({
          open: true,
          message: "Added to wishlist ❤️",
          severity: "success",
        });
      } else {
        await removeFromWishlist(product._id);
        setWishlistItems((prev) =>
          prev.filter((id) => id !== product._id)
        );
        setSnackbar({
          open: true,
          message: "Removed from wishlist",
          severity: "info",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Action failed",
        severity: "error",
      });
    }
  };

  const goToDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-lg
        hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer flex flex-col items-center">

        <img
          src={imgSrc}
          alt={product.name}
          className="h-48 object-contain mb-4"
        />

        <h3 className="font-bold">{product.name}</h3>
        <p className="text-sky-600 font-bold">${product.price}</p>

        <FaHeart
          onClick={handleToggleWishlist}
          className={`text-2xl mt-3 cursor-pointer ${
            isLiked ? "text-red-500" : "text-gray-300"
          }`}
        />

        <motion.button
          onClick={goToDetails}
          whileHover={{ scale: 1.05 }}
          className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400"
        >
          View Details
        </motion.button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
