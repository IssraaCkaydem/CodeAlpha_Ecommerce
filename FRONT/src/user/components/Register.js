
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "../../context/AuthContext";
import { register } from "../../services/authService";
import '../../styles/tailwind.css';


export default function Register() {
  const { setIsAuthenticated, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);

      if (res.success) {
        setIsAuthenticated(true);
        setUser(res.user);

        setSnackbar({
          open: true,
          message: res.message || "Registered successfully!",
          severity: "success",
        });

        setTimeout(() => {
          navigate(res.user.role === "admin" ? "/admin/dashboard" : "/");
        }, 1000);
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-5 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-[350px] 
          bg-white 
          border border-gray-300 
          rounded-xl 
          shadow-md 
          p-8 
          text-center
          max-md:w-[90%]
          max-sm:w-full max-sm:border-none max-sm:shadow-none
        "
      >
        <h1 className="font-['Billabong'] text-5xl mb-6 max-md:text-4xl">
          ElectroShop
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <motion.input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
            required
            className="
              w-full p-3 text-sm 
              bg-[#fafafa] 
              border border-gray-300 
              rounded-md 
              focus:outline-none 
              focus:border-blue-500 
              focus:bg-white
            "
          />

          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
            required
            className="
              w-full p-3 text-sm 
              bg-[#fafafa] 
              border border-gray-300 
              rounded-md 
              focus:outline-none 
              focus:border-blue-500 
              focus:bg-white
            "
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
            autoComplete="new-password"
            required
            className="
              w-full p-3 text-sm 
              bg-[#fafafa] 
              border border-gray-300 
              rounded-md 
              focus:outline-none 
              focus:border-blue-500 
              focus:bg-white
            "
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              mt-2
              w-full 
              py-3 
              rounded-md 
              text-white 
              font-bold 
              bg-gradient-to-r 
              from-blue-500 
              via-emerald-400 
              to-white
              hover:opacity-90
            "
          >
            Sign Up
          </motion.button>
        </form>

        <p className="mt-4 text-sm text-gray-800">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:underline">
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
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
