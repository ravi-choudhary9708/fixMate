"use client";
import { useEffect, useState } from "react";

export default function ChatBox({ ticketId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    const res = await fetch(`/api/ticket/${ticketId}/message`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    if (ticketId) fetchMessages();
  }, [ticketId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("fixmate_token");
    await fetch(`/api/ticket/${ticketId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: newMessage }),
    });
    setNewMessage("");
    fetchMessages();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] max-h-[500px] bg-white shadow-2xl border rounded-2xl flex flex-col">
      <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <h4 className="font-semibold text-sm">Ticket Chat</h4>
        <button onClick={onClose} className="text-white text-lg">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <p className="text-xs text-gray-500 font-medium">
              {msg.senderName} ({msg.senderRole})
            </p>
            <p className="text-sm text-gray-700">{msg.message}</p>
            <p className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex border-t">
        <input
          type="text"
          className="flex-1 px-3 py-2 outline-none text-sm"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="px-4 bg-indigo-600 text-white text-sm">Send</button>
      </form>
    </div>
  );
}
