
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient"; 
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import "../../styles/Register.css"; 

export default function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ name: "", email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log("Base URL:", process.env.REACT_APP_API_URL); 


    try {
      const res = await axiosClient.post("/auth/register", formData); 

      if (res.data.success) {
        setIsAuthenticated(true);

        setSnackbar({
          open: true,
          message: res.data.msg || "Registered successfully!",
          severity: "success",
        });

        setTimeout(() => navigate("/"), 1000);
      } else {
        setSnackbar({
          open: true,
          message: res.data.msg || "Registration failed!",
          severity: "error",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        (err.response?.data?.errors && err.response.data.errors.join(", ")) ||
        "Registration failed!";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <div className="register-container">
      <motion.div
        className="register-box"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="register-logo">ElectroShop</h1>

        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
          <motion.input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="register-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
            required
            autoComplete="new-password"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            className="register-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </p>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
