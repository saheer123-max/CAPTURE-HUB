// src/Photographer/CustomerChatReceiver.jsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Send } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../Contexts/UserContext'; 
import { useGlobalContext } from '../Context/GlobalContext';// ✅ Only use useUser, not UserProvider here

const CustomerChatReceiver = ({ customerName, customerId }) => {
  const { currentUser } = useUser(); // ✅ using context
  const [photographerId, setPhotographerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);
  const [targetUser, setTargetUser] = useState(null);



  useEffect(() => {
  const storedTarget = localStorage.getItem("targetUser");
  if (storedTarget) {
    const parsed = JSON.parse(storedTarget);
    setTargetUser(parsed);
    console.log("✅ targetUser loaded from localStorage:", parsed);
  } else {
    console.warn("⛔ targetUser not found in localStorage");
  }
}, []);


  useEffect(() => {
  console.log("✅ currentUser:", currentUser);
  console.log("✅ targetUser:", targetUser);
}, [currentUser, targetUser]);
  // ✅ Set photographerId from context.currentUser if available
  useEffect(() => {
    if (currentUser?.id) {
      setPhotographerId(currentUser.id);
      console.log("📸 Photographer ID from context:", currentUser.id);
    } else {
      // fallback: extract from token
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        setPhotographerId(id);
        console.log("📸 Photographer ID from JWT fallback:", id);
      }
    }
  }, [currentUser]);

  // ✅ Setup SignalR connection
  useEffect(() => {
    if (!photographerId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7037/chathub", {
        accessTokenFactory: () => localStorage.getItem("token") || ''
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("✅ SignalR connected for photographer:", photographerId);
newConnection.on("ReceiveMessage", (senderId, message) => {
  const isCustomer = String(senderId) === String(customerId); // ✅ true ആണെങ്കിൽ customer

  const newMsg = {
    id: Date.now(),
    text: message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: isCustomer ? 'customer' : 'photographer' // ✅
  };

  setMessages((prev) => [...prev, newMsg]);
});

      })
      .catch((err) => console.error("❌ SignalR connection error:", err));

    return () => {
      newConnection.stop();
    };
  }, [photographerId]);

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async () => {
    if (!newMessage.trim() || !connection || !photographerId) return;

    try {
      await connection.invoke("SendMessage", customerId.toString(), newMessage);

      const reply = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'photographer'
      };

      setMessages((prev) => [...prev, reply]);
      setNewMessage('');
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/70">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{customerName || 'Customer'}</h3>
            <p className="text-sm text-green-400">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              {photographerId} നിന്നുള്ള സന്ദേശങ്ങൾ ഇവിടെ പ്രത്യക്ഷപ്പെടും
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  message.sender === 'customer'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/70">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="നിന്റെ മറുപടി എഴുതുക..."
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          />
          <button
            onClick={sendReply}
            disabled={!newMessage.trim() || !connection}
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerChatReceiver;
