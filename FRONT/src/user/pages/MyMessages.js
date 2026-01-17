
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchContacts,
  sendReply,
  connectMessageSocket,
  disconnectMessageSocket,
} from "../../services/messageService";

export default function MyMessages({ user }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [replyText, setReplyText] = useState({});

  // Fetch initial contacts
  useEffect(() => {
    if (!user?._id) return;

    const loadContacts = async () => {
      try {
        const data = await fetchContacts();
        setContacts(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadContacts();
  }, [user?._id]);

  // Socket real-time updates
  useEffect(() => {
    if (!user?._id) return;

    connectMessageSocket(user._id, (updatedContact) => {
      setContacts(prev =>
        prev.map(c => (c._id === updatedContact._id ? updatedContact : c))
      );
    });

    return () => disconnectMessageSocket();
  }, [user?._id]);

  const handleSendReply = async (contactId) => {
    const text = replyText[contactId];
    if (!text) return;

    try {
      const updatedContact = await sendReply(contactId, text);
      setContacts(prev =>
        prev.map(c => (c._id === contactId ? updatedContact : c))
      );
      setReplyText(prev => ({ ...prev, [contactId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white/90 hover:text-white transition text-sm sm:text-base"
      >
        ← Back
      </button>

      <h1 className="text-center text-3xl sm:text-4xl font-extrabold mb-8 text-white drop-shadow-lg">
        My Messages
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {contacts.length === 0 ? (
          <p className="text-center text-white/80 text-lg sm:text-xl">
            You have no messages yet.
          </p>
        ) : (
          contacts.map(contact => (
            <div
              key={contact._id}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col gap-3"
            >
              <p className="text-sm sm:text-base mb-2">
                Status: 
                <span className={`ml-2 font-bold ${
                  contact.status === "pending"
                    ? "text-yellow-500"
                    : contact.status === "read"
                    ? "text-blue-500"
                    : "text-green-600"
                }`}>
                  {contact.status.toUpperCase()}
                </span>
              </p>

              <div className="flex flex-col gap-2 mb-3">
                {contact.messages.map(m => (
                  <div
                    key={m._id}
                    className={`p-2 rounded-lg text-sm sm:text-base break-words ${
                      m.sender === "user"
                        ? "bg-emerald-100 self-end text-right"
                        : "bg-gray-100 self-start text-left"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={replyText[contact._id] || ""}
                  onChange={e =>
                    setReplyText(prev => ({
                      ...prev,
                      [contact._id]: e.target.value
                    }))
                  }
                  placeholder="Write a reply..."
                  className="border flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:w-auto"
                />
                <button
                  onClick={() => handleSendReply(contact._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                >
                  Send
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
