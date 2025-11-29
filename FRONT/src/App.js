
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Layout from "./user/components/Layout";

// Components
import Home from "./user/pages/Home";
import Login from "./user/components/Login";
import Register from "./user/components/Register";
import Products from "./user/pages/Products";
import ProductDetails from "./user/pages/ProductDetails";
import SearchPage from "./user/pages/SearchPage";
import CartPage from "./user/pages/CartPage";
import WishlistPage from "./user/pages/WishlistPage";
import MyOrders from "./user/pages/MyOrders";

import AdminOrders from "./admin/pages/AdminOrders";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAddProduct from "./admin/pages/AdminAddProduct";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminEditProduct from "./admin/pages/AdminEditProduct";


// PrivateRoute Component
function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/auth/check", { withCredentials: true })
      .then((res) => setIsAuthenticated(res.data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated}><Layout setIsAuthenticated={setIsAuthenticated} /></PrivateRoute>}>

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
  path="/admin/add-product"
  element={
    <AdminRoute>
      <AdminAddProduct />
    </AdminRoute>
  }
/>

<Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
<Route path="/admin/edit-product/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;

