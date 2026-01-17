
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { checkAuth, refreshToken } from "./services/authService";

import Layout from "./user/components/Layout";

// Pages
import Home from "./user/pages/Home";
import Login from "./user/components/Login";
import Register from "./user/components/Register";
import Products from "./user/pages/Products";
import ProductDetails from "./user/pages/ProductDetails";
import SearchPage from "./user/pages/SearchPage";
import CartPage from "./user/pages/CartPage";
import WishlistPage from "./user/pages/WishlistPage";
import MyOrders from "./user/pages/MyOrders";
import ContactPage from "./user/pages/ContactPage";
import MyMessages from "./user/pages/MyMessages"; 
import MyMessagesWrapper from "./user/pages/MyMessagesWrapper";



// Admin Pages
import AdminOrders from "./admin/pages/AdminOrders";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAddProduct from "./admin/pages/AdminAddProduct";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminEditProduct from "./admin/pages/AdminEditProduct";
import AdminContact from "./admin/pages/AdminContact"
/* =========================
   Private Route (User)
========================= */
function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/* =========================
   Admin Route
========================= */
function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "admin"
    ? <Outlet />
    : <Navigate to="/" replace />;
}

/* =========================
   Routes
========================= */
function AppRoutes() {
  const { setIsAuthenticated, setUser } = useAuth();

  // 🔁 refresh token once when app loads
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await refreshToken(); // POST /auth/refresh
        setIsAuthenticated(true);
        setUser(data.user);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    verifyAuth();
  }, [setIsAuthenticated, setUser]);

  return (
    <Router>
      <Routes>

        {/* ===== Auth ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>

          {/* ===== Public ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ===== User Protected ===== */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-messages" element={<MyMessagesWrapper />} />
          </Route>

        </Route>

        {/* ===== Admin ===== */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
          <Route path="/admin/contact" element={<AdminContact />} />
        </Route>

        {/* ===== Fallback ===== */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

/* =========================
   App
========================= */
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
