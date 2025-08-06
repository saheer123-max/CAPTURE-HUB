// CustomerChatReceiver.jsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Send } from 'lucide-react';

const Messages = ({ customerName, customerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // TODO: Replace with your actual message receiving logic
  // useEffect(() => {
    // Example: Listen for incoming messages from your backend/SignalR
    // connection.on("ReceiveMessage", (fromUser, message) => {
    //   if (fromUser === customerId) {
    //     const newMsg = {
    //       id: Date.now(),
    //       text: message,
    //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //       sender: 'customer'
    //     };
    //     setMessages(prev => [...prev, newMsg]);
    //   }
    // });
  // }, [customerId]);





  useEffect(() => {
  const fetchMessages = async () => {
    const response = await fetch(`${backendUrl}/api/messages/${customerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setMessages(data);
  };

  fetchMessages();
}, [customerId]);


  const sendReply = async () => {
    if (!newMessage.trim()) return;

    // TODO: Replace with your actual send message logic
    // await connection.invoke("SendMessage", "photographer", customerId, newMessage);
    
    const reply = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'photographer'
    };

    setMessages(prev => [...prev, reply]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden">
      {/* Chat Header */}
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

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              Messages from {customerName || 'customer'} will appear here
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'photographer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  message.sender === 'photographer'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'photographer' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/70">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your reply..."
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          />
          <button
            onClick={sendReply}
            disabled={!newMessage.trim()}
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;