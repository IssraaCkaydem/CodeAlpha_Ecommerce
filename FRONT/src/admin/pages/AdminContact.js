
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";



export default function AdminContact() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [replyText, setReplyText] = useState({});

  // Fetch all contacts
  useEffect(() => {
    axiosClient.get("/contact", { withCredentials: true })
      .then(res => setContacts(res.data.data))
      .catch(console.error);
  }, []);

  
  useEffect(() => {
   // socket.emit("join", "admin-room");
   socket.emit("join-admin");


    const handleUpdate = (updated) => {
      setContacts(prev =>
        prev.map(c => c._id === updated._id ? updated : c)
      );
    };

    socket.on("contactUpdated", handleUpdate);

    return () => {
      socket.off("contactUpdated", handleUpdate);
    };
  }, []);

  const sendReply = async (id) => {
    if (!replyText[id]) return;

    try {
      const res = await axiosClient.post(
        `/contact/${id}/admin-reply`,
        { text: replyText[id] },
        { withCredentials: true }
      );

      setContacts(prev =>
        prev.map(c => c._id === id ? res.data.data : c)
      );

      setReplyText(prev => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axiosClient.delete(`/contact/${id}`, { withCredentials: true });
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axiosClient.patch(
        `/contact/${id}`,
        { status },
        { withCredentials: true }
      );
      setContacts(prev =>
        prev.map(c => c._id === id ? res.data.data : c)
      );
    } catch (err) {
      console.error("Status update error:", err);
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

      <h1 className="text-4xl font-extrabold mb-8 text-white text-center drop-shadow-lg">
        Admin Contact
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {contacts.map(contact => (
          <div
            key={contact._id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <p className="font-bold mb-2">{contact.name} ({contact.email})</p>

            {/* Conversation */}
            <div className="space-y-2 mb-4">
              {contact.messages.map(m => (
                <div
                  key={m._id}
                  className={`p-2 rounded text-sm ${
                    m.sender === "admin" ? "bg-blue-100 text-right" : "bg-gray-100"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Status */}
            <p className="mb-2">
              Status: <span className={
                contact.status === "pending" ? "text-yellow-500" :
                contact.status === "read" ? "text-blue-500" :
                "text-green-600"
              }>{contact.status.toUpperCase()}</span>
            </p>

            {/* Actions */}
            <div className="flex gap-2 mb-3">
              {contact.status !== "read" && (
                <button
                  onClick={() => updateStatus(contact._id, "read")}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Mark as Read
                </button>
              )}
              {contact.status !== "resolved" && (
                <button
                  onClick={() => updateStatus(contact._id, "resolved")}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Resolve
                </button>
              )}
              <button
                onClick={() => deleteMessage(contact._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>

            {/* Reply */}
            <div className="flex gap-2">
              <input
                value={replyText[contact._id] || ""}
                onChange={e =>
                  setReplyText(prev => ({ ...prev, [contact._id]: e.target.value }))
                }
                placeholder="Reply..."
                className="border px-3 py-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={() => sendReply(contact._id)}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
