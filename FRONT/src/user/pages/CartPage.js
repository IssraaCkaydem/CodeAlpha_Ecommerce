
import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "../../styles/CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [orderData, setOrderData] = useState({ name: "", phone: "", address: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const fetchCart = async () => {
    try {
      const res = await axiosClient.get("/cart", { withCredentials: true });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axiosClient.post("/cart/remove", { productId }, { withCredentials: true });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await axiosClient.post("/cart/clear", {}, { withCredentials: true });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderData.name || !orderData.phone || !orderData.address) {
      setSnackbar({ open: true, message: "Please fill all fields", severity: "warning" });
      return;
    }

    if (cart.items.length === 0) {
      setSnackbar({ open: true, message: "Cart is empty", severity: "error" });
      return;
    }

    try {
      const items = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      await axiosClient.post("/orders/confirm", { ...orderData, items }, { withCredentials: true });

      setSnackbar({ open: true, message: "Order confirmed successfully!", severity: "success" });
      setOpenForm(false);
      setOrderData({ name: "", phone: "", address: "" });
      fetchCart();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || "Failed to confirm order";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <Box className="cart-container">
    <Button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
  ← Back
</Button>

      <Typography variant="h3" className="cart-title">
        Your Cart
      </Typography>

      {cart.items.length === 0 ? (
        <Typography variant="h6" className="empty-cart">
          Your cart is empty
        </Typography>
      ) : (
        <Box className="cart-items">
          {cart.items.map((item) => (
            <motion.div
              key={item.product._id}
              className="cart-item"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={item.product.imageUrl || "/fallback.png"}
                alt={item.product.name}
                className="cart-item-img"
              />
              <Box className="cart-item-info">
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
                <Typography>Price: ${item.product.price}</Typography>
              </Box>
              <Button
                variant="contained"
                className="remove-btn"
                onClick={() => handleRemove(item.product._id)}
              >
                Remove
              </Button>
            </motion.div>
          ))}

          <Box className="cart-total">
            <Typography variant="h5">Total: ${cart.total}</Typography>
            <Button variant="contained" className="clear-btn" onClick={handleClear}>
              Remove All
            </Button>
            <Button
              variant="contained"
              color="success"
              style={{ marginLeft: "10px" }}
              onClick={() => setOpenForm(true)}
            >
              Confirm Order
            </Button>
          </Box>

          {openForm && (
            <Paper elevation={4} className="order-form">
              <Typography variant="h5" style={{ marginBottom: "15px" }}>
                Complete Your Order
              </Typography>

              <input
                type="text"
                placeholder="Your Name"
                value={orderData.name}
                onChange={(e) =>
                  setOrderData({ ...orderData, name: e.target.value })
                }
                className="form-input"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={orderData.phone}
                onChange={(e) =>
                  setOrderData({ ...orderData, phone: e.target.value })
                }
                className="form-input"
              />

              <textarea
                placeholder="Address"
                value={orderData.address}
                onChange={(e) =>
                  setOrderData({ ...orderData, address: e.target.value })
                }
                className="form-textarea"
              />

              <Box style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <Button variant="contained" color="success" onClick={handleConfirmOrder}>
                  Submit
                </Button>
                <Button variant="outlined" color="error" onClick={() => setOpenForm(false)}>
                  Cancel
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
