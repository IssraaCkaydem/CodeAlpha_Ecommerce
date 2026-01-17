
import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white/90 hover:text-white transition"
      >
        ← Back
      </button>

      <motion.div
        className="max-w-lg mx-auto p-10 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl text-center text-gray-800 mb-6 font-bold">
          Add New Product
        </h1>

        {message && (
          <p className={`text-center font-bold mb-4 ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="mb-4"
          />

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-36 h-auto mb-4 mx-auto rounded-md"
            />
          )}

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="mb-6 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            disabled={uploading}
            className="py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition"
          >
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
