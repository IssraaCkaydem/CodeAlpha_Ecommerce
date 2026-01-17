// services/cartService.js
import axiosClient from "../api/axiosClient";

// Fetch cart
export const fetchCart = async () => {
  try {
    const res = await axiosClient.get("/cart", { withCredentials: true });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch cart");
  }
};

// Remove single item
export const removeFromCart = async (productId) => {
  try {
    const res = await axiosClient.post("/cart/remove", { productId }, { withCredentials: true });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to remove item");
  }
};

// Clear all items
export const clearCart = async () => {
  try {
    const res = await axiosClient.post("/cart/clear", {}, { withCredentials: true });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to clear cart");
  }
};

// Confirm order
export const confirmOrder = async (orderData, items) => {
  try {
    const res = await axiosClient.post(
      "/orders/confirm",
      { ...orderData, items },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.msg || "Failed to confirm order");
  }
};


export const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axiosClient.post(
        "/cart/add",
        { productId, quantity },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to add to cart");
    }
  };