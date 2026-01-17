// src/services/productDetailService.js
import axiosClient from "../api/axiosClient";
import { getWishlist as fetchWishlistService, addToWishlist as addWishlistService, removeFromWishlist as removeWishlistService } from "./wishlistService";
import { addToCart as addToCartService } from "./cartService";

// Fetch product by ID
export const fetchProductById = async (id) => {
  try {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch product");
  }
};

// Check if product is in wishlist
export const checkWishlist = async (userId, productId) => {
  try {
    const res = await fetchWishlistService();
    return res.items.some((item) => item._id === productId);
  } catch (err) {
    console.error("Wishlist check failed");
    return false;
  }
};

// Add product to cart
export const addToCart = async (productId, quantity) => {
  try {
    return await addToCartService(productId, quantity);
  } catch (err) {
    throw new Error("Failed to add to cart");
  }
};

// Toggle wishlist
export const toggleWishlist = async (productId, liked) => {
  try {
    if (!liked) {
      await addWishlistService(productId);
      return true;
    } else {
      await removeWishlistService(productId);
      return false;
    }
  } catch (err) {
    throw new Error("Failed to update wishlist");
  }
};
