// src/services/productService.js
import axiosClient from "../api/axiosClient";

export const fetchProducts = async ({
  category = "all",
  page = 1,
  limit = 9,
  min = "",
  max = "",
}) => {
  try {
    let url =
      category === "all"
        ? `/products?page=${page}&limit=${limit}`
        : `/products/category/${category}?page=${page}&limit=${limit}`;

    if (min) url += `&min=${min}`;
    if (max) url += `&max=${max}`;

    const res = await axiosClient.get(url);

    return {
      products: res.data.products || [],
      totalPages: res.data.pages || res.data.totalPages || 1,
    };
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(
      err.response?.data?.message || "Failed to fetch products"
    );
  }
};
