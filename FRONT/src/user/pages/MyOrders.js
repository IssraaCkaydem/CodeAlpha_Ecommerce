
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { io } from "socket.io-client";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

const MyOrders = () => {
  const navigate = useNavigate(); 
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders/my-orders"); 
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back
      </Button>

      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  Product ID: {item.product} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
