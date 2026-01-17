
import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  fetchCart,
  removeFromCart,
  clearCart,
  confirmOrder,
} from "../../services/cartService";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // ===== Load cart =====
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCart();
  }, []);

  // ===== Handlers =====
  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    setCart(await fetchCart());
  };

  const handleClear = async () => {
    await clearCart();
    setCart(await fetchCart());
  };

  const handleConfirmOrder = async () => {
    if (!orderData.name || !orderData.phone || !orderData.address) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "warning",
      });
      return;
    }

    if (cart.items.length === 0) {
      setSnackbar({
        open: true,
        message: "Cart is empty",
        severity: "error",
      });
      return;
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    await confirmOrder(orderData, items);

    setSnackbar({
      open: true,
      message: "Order confirmed successfully!",
      severity: "success",
    });

    setOpenForm(false);
    setOrderData({ name: "", phone: "", address: "" });
    setCart(await fetchCart());
  };

  // ===== Render =====
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">
   
        <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition"
      >
        ← <span className="underline">Back</span>
      </button>

      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Your Cart
      </h1>

      {cart.items.length === 0 ? (
        <p className="text-center text-xl text-gray-700">
          Your cart is empty
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {cart.items.map((item) => (
            <motion.div
              key={item.product._id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={item.product.imageUrl || "/fallback.png"}
                alt={item.product.name}
                className="w-24 h-24 object-contain rounded"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {item.product.name}
                </h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.product.price}</p>
              </div>

              <button
                onClick={() => handleRemove(item.product._id)}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90"
              >
                Remove
              </button>
            </motion.div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <h2 className="text-2xl font-bold">
              Total: ${cart.total}
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-full font-semibold"
              >
                Remove All
              </button>

              <button
                onClick={() => setOpenForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold"
              >
                Confirm Order
              </button>
            </div>
          </div>

          {openForm && (
            <div className="bg-white p-6 mt-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">
                Complete Your Order
              </h3>

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded mb-3"
                value={orderData.name}
                onChange={(e) =>
                  setOrderData({ ...orderData, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded mb-3"
                value={orderData.phone}
                onChange={(e) =>
                  setOrderData({ ...orderData, phone: e.target.value })
                }
              />

              <textarea
                placeholder="Address"
                className="w-full p-3 border rounded mb-3 h-24"
                value={orderData.address}
                onChange={(e) =>
                  setOrderData({ ...orderData, address: e.target.value })
                }
              />

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmOrder}
                  className="bg-green-600 text-white px-5 py-2 rounded font-semibold"
                >
                  Submit
                </button>

                <button
                  onClick={() => setOpenForm(false)}
                  className="border border-red-500 text-red-500 px-5 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

