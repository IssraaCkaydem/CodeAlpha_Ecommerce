// src/services/orderService.js
import axiosClient from "../api/axiosClient";
import { io } from "socket.io-client";

let socket;

export const connectOrderSocket = (onUpdate) => {
  socket = io("http://localhost:4000", {
    withCredentials: true,
  });

  socket.on("orderUpdated", onUpdate);
};

export const disconnectOrderSocket = () => {
  if (socket) {
    socket.off("orderUpdated");
    socket.disconnect();
  }
};

// Fetch user's orders
export const fetchMyOrders = async () => {
  try {
    const res = await axiosClient.get("/orders/my-orders", {
      withCredentials: true,
    });

    return res.data.orders || [];
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(err.response?.data?.message || "Failed to fetch orders");
  }
};
