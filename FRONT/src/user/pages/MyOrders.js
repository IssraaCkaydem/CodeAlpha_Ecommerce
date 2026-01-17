
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchMyOrders,
  connectOrderSocket,
  disconnectOrderSocket,
} from "../../services/orderService";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          navigate("/login");
        } else {
          console.error(err);
        }
      }
    };

    loadOrders();

    // Socket updates
    connectOrderSocket((updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => disconnectOrderSocket();
  }, [navigate]);

  return (
    <div className="min-h-screen p-5 sm:p-8 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">

      {/* 🔙 Back */}
      <Button
        onClick={() => navigate(-1)}
        className="mb-6 text-white/90 hover:text-white transition text-sm sm:text-base"
      >
        ← Back
      </Button>

      {/* Header */}
      <h1 className="text-center text-3xl sm:text-4xl font-extrabold mb-8 text-white drop-shadow-lg">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-lg sm:text-xl text-white/80">
          You have no orders yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <p className="text-gray-700 text-sm sm:text-base">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p
                  className={`font-semibold text-sm sm:text-base ${
                    order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "processing"
                      ? "text-blue-500"
                      : order.status === "shipped"
                      ? "text-purple-500"
                      : "text-green-600"
                  }`}
                >
                  {order.status.toUpperCase()}
                </p>
              </div>

              {/* Order Items */}
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-2 last:border-b-0"
                  >
                    <img
                      src={item.product.imageUrl || "/fallback.png"}
                      alt={item.product.name}
                      className="w-full sm:w-24 h-24 sm:h-24 object-contain rounded"
                    />
                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <p className="font-bold text-gray-800">{item.product.name}</p>
                      <p className="text-gray-600 mt-1 sm:mt-0">
                        ${item.product.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
