

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import {
  fetchProductById,
  checkWishlist,
  addToCart,
  toggleWishlist,
} from "../../services/productDetailService";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch product & check wishlist
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);

        if (user) {
          const isLiked = await checkWishlist(user._id, id);
          setLiked(isLiked);
        }
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          navigate("/login", { state: { from: `/product/${id}` } });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user, navigate]);

  if (loading)
    return <h2 className="text-center text-xl sm:text-2xl mt-20 text-white">Loading...</h2>;

  if (!product)
    return <h2 className="text-center text-xl sm:text-2xl mt-20 text-white">Product not found</h2>;

  // Handlers
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    try {
      await addToCart(product._id, quantity);
      setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    try {
      const newLiked = await toggleWishlist(product._id, liked);
      setLiked(newLiked);
      setSnackbar({
        open: true,
        message: newLiked ? "Added to wishlist!" : "Removed from wishlist!",
        severity: newLiked ? "success" : "info",
      });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <div className="min-h-screen p-5 sm:p-8 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white flex flex-col md:flex-row gap-6 md:gap-10">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 flex items-center gap-2 text-white/90 hover:text-white transition font-semibold text-sm sm:text-base"
      >
        ← Back
      </button>

      {/* Product Image */}
      <img
        src={product.imageUrl || product.image || "/fallback.png"}
        alt={product.name}
        className="w-full sm:w-80 md:w-96 h-auto object-contain rounded-xl shadow-lg bg-gradient-to-br from-sky-500 via-emerald-400 to-white"
      />

      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{product.name}</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-white">${product.price}</h2>
        <p className="text-sm sm:text-base md:text-lg text-white/90">{product.description}</p>

        {/* Quantity + Cart + Wishlist */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
            className="w-20 sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 transition shadow-md active:scale-95"
          >
            Add to Cart
          </button>

          <FaHeart
            onClick={handleWishlist}
            className={`text-2xl sm:text-3xl cursor-pointer transition-colors ${liked ? "text-red-500" : "text-gray-300"}`}
          />
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
