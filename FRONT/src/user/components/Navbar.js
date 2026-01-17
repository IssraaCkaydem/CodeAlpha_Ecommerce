
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";

// 🟢 socket connection
const socket = io("http://localhost:4000", { withCredentials: true });

export default function Navbar() {
  const { user, setIsAuthenticated, setUser } = useAuth();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // CLICK OUTSIDE CLOSE MENU
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // SOCKET JOINS
  useEffect(() => {
    if (!user?._id) return;
   // socket.emit("join", user._id);
   socket.emit("join-user", user._id);

    socket.on("wishlistUpdated", (data) => setWishlistCount(data.wishlist.length));
    socket.on("cartUpdated", (data) => {
      const count = data.cart.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    });
    return () => {
      socket.off("wishlistUpdated");
      socket.off("cartUpdated");
    };
  }, [user]);

  // FETCH WISHLIST
  useEffect(() => {
    if (!user?._id) return;
    axiosClient.get("/wishlist", { withCredentials: true })
      .then((res) => setWishlistCount(res.data.items.length))
      .catch(() => setWishlistCount(0));
  }, [user]);

  // FETCH CART
  useEffect(() => {
    if (!user?._id) return;
    axiosClient.get("/cart", { withCredentials: true })
      .then((res) => {
        const count = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  }, [user]);

  const handleSearch = () => {
    if (!search) return;
    navigate(`/search?q=${search}`);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      setCartCount(0);
      setWishlistCount(0);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-gradient-to-br from-blue-500 via-green-400 to-white shadow-md"
    >
      <div className="flex justify-between items-center p-4 md:p-6">
        <Link to="/" className="text-2xl md:text-3xl font-bold text-blue-900">
          MyShop
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:block relative w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full py-2 pl-10 pr-4 rounded-full bg-white/90 focus:bg-white outline-none text-base"
          />
          <FaSearch
            onClick={handleSearch}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-900 cursor-pointer"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-blue-900 font-semibold">Products</Link>
          <Link to="/contact" className="text-blue-900 font-semibold">Contact</Link>

          <Link to="/wishlist" className="relative text-blue-900">
            <FaHeart className="text-2xl" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-blue-900">
            <FaShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setIsMenuOpen((p) => !p)}
              className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center cursor-pointer"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white border rounded-lg shadow-lg z-[999]">
                <Link to="/my-orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                <Link to="/my-messages" className="block px-4 py-2 hover:bg-gray-100">My Messages</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <FaSearch onClick={handleSearch} className="text-blue-900 text-xl cursor-pointer" />
          <div onClick={() => setIsMobileMenuOpen((p) => !p)} className="text-blue-900 text-2xl cursor-pointer">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md p-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full py-2 pl-4 pr-4 rounded-full bg-gray-100 outline-none text-base"
          />
          <Link to="/products" className="text-blue-900 font-semibold">Products</Link>
          <Link to="/contact" className="text-blue-900 font-semibold">Contact</Link>
          <Link to="/wishlist" className="relative text-blue-900">
            Wishlist
            {wishlistCount > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2">{wishlistCount}</span>
            )}
          </Link>
          <Link to="/cart" className="relative text-blue-900">
            Cart
            {cartCount > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2">{cartCount}</span>
            )}
          </Link>
          <Link to="/my-orders" className="text-blue-900 font-semibold">My Orders</Link>
          <Link to="/my-messages" className="text-blue-900 font-semibold">My Messages</Link>
          <button onClick={handleLogout} className="text-left text-blue-900 font-semibold">Logout</button>
        </div>
      )}
    </motion.nav>
  );
}
