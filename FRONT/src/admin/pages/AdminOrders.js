
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";
import "../../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role !== "admin") {
      navigate("/"); 
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get("/orders/all"); 
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/orders/update-status/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-orders-container">
      <h1>All Orders (Admin)</h1>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders yet</p>
      ) : (
        orders.map((order) => (
          <motion.div
            key={order._id}
            className="order-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>User:</strong> {order.user.name} ({order.user.email})</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>

            <p>
              <span className="status-label">Status:</span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </p>

            <p><strong>Items:</strong></p>
            <ul className="items-list">
              {order.items.map((item) => (
                <li key={item._id}>
                  Product ID: {item.product} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
