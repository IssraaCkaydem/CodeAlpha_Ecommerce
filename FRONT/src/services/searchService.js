// src/services/searchService.js
import axiosClient from "../api/axiosClient";

export const searchProducts = async (query) => {
  try {
    const res = await axiosClient.get(`/search?q=${query}`, {
      withCredentials: true,
    });

    return res.data || [];
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(
      err.response?.data?.message || "Search failed"
    );
  }
};
