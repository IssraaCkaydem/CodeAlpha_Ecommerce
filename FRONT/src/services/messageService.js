// src/services/messageService.js
import axiosClient from "../api/axiosClient";
import { io } from "socket.io-client";

let socket;

// Connect socket for the user
export const connectMessageSocket = (userId, onContactUpdated) => {
  if (!userId) return;

  socket = io("http://localhost:4000", { withCredentials: true });

  socket.emit("join-user", userId);

  socket.off("contactUpdated");
  socket.on("contactUpdated", onContactUpdated);
};

export const disconnectMessageSocket = () => {
  if (socket) {
    socket.off("contactUpdated");
    socket.disconnect();
  }
};

// Fetch initial contacts for user
export const fetchContacts = async () => {
  try {
    const res = await axiosClient.get("/contact/user", { withCredentials: true });
    return res.data.data || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch contacts");
  }
};

// Send a reply
export const sendReply = async (contactId, text) => {
  try {
    const res = await axiosClient.post(
      `/contact/${contactId}/user-reply`,
      { text },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to send reply");
  }
};
