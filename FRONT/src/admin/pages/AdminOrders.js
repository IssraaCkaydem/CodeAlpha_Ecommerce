
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get("/orders/all", { withCredentials: true }); 
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/orders/update-status/${orderId}`, { status: newStatus }, { withCredentials: true });
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
    <div className="min-h-screen p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white/90 hover:text-white transition"
      >
        ← Back
      </button>

      <h1 className="text-center text-4xl font-extrabold mb-8 text-white drop-shadow-lg">
        All Orders (Admin)
      </h1>

      <div className="max-w-3xl mx-auto grid gap-6">
        {orders.length === 0 ? (
          <p className="text-center text-white/90">No orders yet</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-700 mb-1"><strong>Order ID:</strong> {order._id}</p>
              <p className="text-gray-700 mb-1"><strong>User:</strong> {order.user.name} ({order.user.email})</p>
              <p className="text-gray-700 mb-1"><strong>Phone:</strong> {order.phone}</p>
              <p className="text-gray-700 mb-1"><strong>Address:</strong> {order.address}</p>

              <p className="text-gray-700 mb-2">
                <span className="font-semibold mr-2">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </p>

              <p className="text-gray-700 font-semibold mt-2">Items:</p>
              <ul className="list-disc list-inside ml-2">
                {order.items.map((item) => (
                  <li key={item._id} className="text-gray-700">
                    Product ID: {item.product} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
