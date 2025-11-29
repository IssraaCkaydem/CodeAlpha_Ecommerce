
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";
import "../../styles/AdminEditProduct.css";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/products/${id}`, formData, { withCredentials: true });
      setMessage("Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error updating product");
    }
  };

  return (
    <motion.div
      className="admin-edit-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Edit Product</h1>
      {message && (
        <p className={message.includes("Error") ? "error-message" : "message"}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
        <button type="submit">Update Product</button>
      </form>
    </motion.div>
  );
}
