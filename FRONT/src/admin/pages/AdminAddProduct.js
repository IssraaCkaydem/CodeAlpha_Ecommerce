
import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient"; 
import { useNavigate } from "react-router-dom";
import "../../styles/AdminAddProduct.css";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: ""
  });
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("image", file);

    try {
      setUploading(true);
      const res = await axiosClient.post("/upload", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      setUploading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error uploading image");
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setMessage("Please upload an image first!");
      return;
    }

    try {
      await axiosClient.post("/products", formData, { withCredentials: true });
      setMessage("Product added successfully!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error adding product");
    }
  };

  return (
    <motion.div
      className="admin-add-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Add New Product</h1>

      {message && <p className={message.includes("Error") ? "error-message" : "message"}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
{formData.imageUrl && (
  <img
    src={formData.imageUrl} 
    alt="Preview"
    width={150}
    style={{ marginTop: "10px" }}
  />
)}


        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </motion.div>
  );
}
