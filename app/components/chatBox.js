
  // const fetchMessages = async () => {
  //   const res = await fetch(`/api/ticket/${ticketId}/message`);
  //   const data = await res.json();
  //   setMessages(data);
  // };

 import { useEffect, useState } from "react";
import { Send, X, MessageCircle, User } from "lucide-react";

export default function ChatBox({ ticketId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "You", role: "user" });

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/ticket/${ticketId}/message`);
      const data = await res.json();
      
      // Ensure each message has a unique ID and isCurrentUser property
      const processedMessages = data.map((msg, index) => ({
        ...msg,
        id: msg.id || `${msg.timestamp}-${index}`, // Use timestamp + index as fallback ID
        isCurrentUser: msg.senderRole === 'user' // Determine if message is from current user
      }));
      
      setMessages(processedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (ticketId) fetchMessages();
  }, [ticketId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    setNewMessage("");
    
    try {
      const token = localStorage.getItem("fixmate_token");
      const response = await fetch(`/api/ticket/${ticketId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (response.ok) {
        // Refresh messages after successful send
        await fetchMessages();
      } else {
        console.error('Failed to send message');
        // Optionally show error message to user
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show error message to user
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'staff': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white shadow-2xl border border-gray-200 rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold">Ticket Chat</h4>
            <p className="text-xs text-indigo-100">Ticket #{ticketId}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={msg.id || `message-${index}`} className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[280px] ${msg.isCurrentUser ? 'order-2' : 'order-1'}`}>
              {!msg.isCurrentUser && (
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-700">{msg.senderName}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getRoleColor(msg.senderRole)}`}>
                      {msg.senderRole}
                    </span>
                  </div>
                </div>
              )}
              
              <div className={`px-4 py-3 rounded-2xl ${
                msg.isCurrentUser 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.message}</p>
              </div>
              
              <p className={`text-[10px] text-gray-400 mt-1 ${msg.isCurrentUser ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[280px]">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">Support Agent</span>
              </div>
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder-gray-500 transition-all duration-200"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}