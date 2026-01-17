
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.js"; 
import { login } from "../../services/authService.js"; // ✅
import '../../styles/tailwind.css';

export default function Login() {
  const { setIsAuthenticated, setUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);

        setSnackbar({
          open: true,
          message: data.message || "Login successful!",
          severity: "success",
        });

        setTimeout(() => {
          navigate(data.user.role === "admin" ? "/admin/dashboard" : "/");
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Login failed!",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa] p-5 font-sans">
      <motion.div
        className="w-[350px] p-8 bg-white border border-gray-300 rounded-xl text-center shadow-md max-md:w-[90%] max-sm:w-full max-sm:border-none max-sm:shadow-none"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-['Billabong'] text-5xl mb-6 max-md:text-4xl max-sm:text-3xl">
          ElectroShop
        </h1>

        <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
            whileFocus={{ scale: 1.02 }}
            className="w-full p-3 border border-gray-300 rounded-md bg-[#fafafa] text-sm focus:outline-none focus:border-blue-500 focus:bg-white max-md:p-2.5 max-md:text-sm"
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            whileFocus={{ scale: 1.02 }}
            className="w-full p-3 border border-gray-300 rounded-md bg-[#fafafa] text-sm focus:outline-none focus:border-blue-500 focus:bg-white max-md:p-2.5 max-md:text-sm"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-md font-bold text-white bg-gradient-to-r from-blue-500 via-emerald-400 to-white hover:opacity-90 max-md:py-2.5 max-md:text-sm"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-4 text-sm text-gray-800">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 font-bold hover:underline">
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
