
import "../../styles/Login.css"; 
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";

export default function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/auth/login", formData);

      if (res.data.success) {
        setIsAuthenticated(true);


        setSnackbar({
          open: true,
          message: res.data.message || "Login successful!",
          severity: "success",
        });

      
setTimeout(() => {
  if (res.data.user.role === "admin") {
    navigate("/admin/dashboard"); 
  } else {
    navigate("/");
  }
}, 1000);


      } else {
        setSnackbar({
          open: true,
          message: res.data.message || "Login failed!",
          severity: "error",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        (err.response?.data?.errors &&
          err.response.data.errors.join(", ")) ||
        "Login failed!";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-box"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="login-title">ElectroShop</h1>

        <form autoComplete="off" onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <motion.button
            type="submit"
            className="login-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="login-link">
            Register
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
