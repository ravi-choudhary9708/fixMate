"use client";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm FixMate Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Option 1: Use API route (Recommended)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const botReply = data.response || "Sorry, I didn't get that.";
      setMessages([...newMessages, { role: "bot", text: botReply }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages([...newMessages, { role: "bot", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white border rounded-lg shadow-xl overflow-hidden flex flex-col z-50">
          <div className="bg-indigo-600 text-white p-3 font-semibold">FixMate Assistant</div>

          <div className="p-3 h-72 overflow-y-auto space-y-2 text-sm flex-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  m.role === "user"
                    ? "bg-indigo-100 self-end text-right ml-4"
                    : "bg-gray-100 text-left mr-4"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 text-left mr-4 p-2 rounded">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex border-t p-2">
            <input
              type="text"
              className="flex-1 px-2 py-1 border rounded mr-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}