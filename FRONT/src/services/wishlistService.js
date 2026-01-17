// src/services/wishlistService.js

import axiosClient from "../api/axiosClient";


export const getWishlist = async () => {
  try {
    const res = await axiosClient.get("/wishlist", { withCredentials: true });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("Unauthorized: Please login first");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch wishlist");
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const res = await axiosClient.post(
      "/wishlist/add",
      { productId },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("Unauthorized: Please login first");
    }
    throw new Error(err.response?.data?.message || "Failed to add to wishlist");
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const res = await axiosClient.post(
      "/wishlist/remove",
      { productId },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("Unauthorized: Please login first");
    }
    throw new Error(err.response?.data?.message || "Failed to remove from wishlist");
  }
};

