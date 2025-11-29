

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import axiosClient from "../../api/axiosClient"; 
import LogoutButton from "./LogoutButton"; 
import "../../styles/Navbar.css";

export default function Navbar({ setIsAuthenticated }) {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosClient.get("/wishlist", { withCredentials: true });
        setWishlistCount(res.data.items.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosClient.get("/cart", { withCredentials: true });
        const count = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const handleSearch = () => {
    if (!search) return;
    navigate(`/search?q=${search}`);
  };

  return (
    <motion.nav
      className="nav"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link to="/" className="logo">MyShop</Link>

      <div className="search-box">
        <FaSearch className="search-icon" onClick={handleSearch} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="nav-right">
        <Link to="/products" className="nav-link">Products</Link>

        <Link to="/wishlist" className="icon-btn">
          <FaHeart />
          <span className="count">{wishlistCount}</span>
        </Link>

        <Link to="/cart" className="icon-btn">
          <FaShoppingCart />
          <span className="count">{cartCount}</span>
        </Link>

        <Link to="/my-orders" className="nav-link">My Orders</Link>

 <span
    className="nav-link"
    onClick={() => {
      axiosClient.post("/auth/logout", {}, { withCredentials: true })
        .then(() => setIsAuthenticated(false))
        .catch((err) => console.error("Logout failed:", err));
    }}
    style={{ cursor: "pointer" }}
  >
    Logout
  </span>
      </div>
    </motion.nav>
  );
}
