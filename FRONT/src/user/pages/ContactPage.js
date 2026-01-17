

import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ContactPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosClient.post("/contact", formData, {
        withCredentials: true,
      });

      setSuccess(res.data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white font-semibold hover:text-white/80 text-sm sm:text-base"
      >
        ← Back
      </button>

      {/* 📩 Contact Form */}
      <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-[#0f3558]">
          Contact Us
        </h2>

        {success && (
          <p className="text-green-600 font-semibold mb-4 text-center text-sm sm:text-base md:text-lg">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-600 font-semibold mb-4 text-center text-sm sm:text-base md:text-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Your Message"
            className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <button className="bg-gradient-to-r from-sky-500 to-emerald-400 text-white py-3 rounded font-bold text-sm sm:text-base md:text-lg hover:from-sky-600 hover:to-emerald-500 transition-colors">
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
}

