import React, { useState, useEffect, useRef } from 'react';
import { User, Send } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { jwtDecode } from 'jwt-decode';
import { useGlobalContext } from '../Context/GlobalContext';

const CustomerChatReceiver = () => {
  const { currentUser, targetUser, setTargetUser } = useGlobalContext();
  const [photographerId, setPhotographerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [customers, setCustomers] = useState([]);
  const messagesEndRef = useRef(null);

  // Set photographer ID from token
  useEffect(() => {
    if (currentUser?.id) {
      setPhotographerId(currentUser.id);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setPhotographerId(
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        );
      }
    }
  }, [currentUser]);

  // Setup SignalR
  useEffect(() => {
    if (!photographerId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7037/chathub', {
        accessTokenFactory: () => localStorage.getItem('token') || '',
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.start().then(() => {
      console.log('✅ Connected to SignalR');

      newConnection.on('ReceiveMessage', (senderId, message) => {
        console.log('📨 Message received from:', senderId, message);

        const newMsg = {
          id: Date.now(),
          text: message,
          sender: 'customer',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Save to allMessages
        setAllMessages((prev) => ({
          ...prev,
          [senderId]: [...(prev[senderId] || []), newMsg],
        }));

        // Add to customer list if not exists
        setCustomers((prev) => {
          const exists = prev.some((c) => c.id === senderId);
          if (!exists) {
            return [...prev, { id: senderId, name: `Customer ${senderId}` }];
          }
          return prev;
        });

        // If viewing same customer, update messages
        if (senderId === customerId) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });
    });

    return () => {
      newConnection.stop();
    };
  }, [photographerId, customerId]);

  // When targetUser changes, show their messages
  useEffect(() => {
    if (targetUser?.id) {
      setCustomerId(targetUser.id);
      setMessages(allMessages[targetUser.id] || []);
    }
  }, [targetUser, allMessages]);

  // Send reply
  const sendReply = async () => {
    if (!newMessage.trim() || !connection || !photographerId || !customerId) return;

    try {
      await connection.invoke(
        'SendMessage',
        photographerId.toString(),
        customerId.toString(),
        newMessage
      );

      const reply = {
        id: Date.now(),
        text: newMessage,
        sender: 'photographer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAllMessages((prev) => ({
        ...prev,
        [customerId]: [...(prev[customerId] || []), reply],
      }));

      setMessages((prev) => [...prev, reply]);
      setNewMessage('');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[90vh] border border-gray-700 rounded-xl overflow-hidden">
      {/* Sidebar – Customer List */}
      <div className="w-1/4 bg-gray-900 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-white text-lg font-bold p-4 border-b border-gray-700">📋 Customers</h2>
        {customers.length === 0 ? (
          <p className="text-gray-400 text-center p-4">No customers yet</p>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => {
                setCustomerId(customer.id);
                setTargetUser(customer);
                setMessages(allMessages[customer.id] || []);
              }}
              className={`cursor-pointer p-3 text-white border-b border-gray-800 hover:bg-gray-800 ${
                customerId === customer.id ? 'bg-gray-800' : ''
              }`}
            >
              {customer.name}
            </div>
          ))
        )}
      </div>

      {/* Chat Section */}
      <div className="w-3/4 bg-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {targetUser?.name || 'Select a Customer'}
              </h3>
              <p className="text-sm text-green-400">● Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
          {messages.map((message) => (
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
                <p
                  className={`text-xs mt-2 ${
                    message.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default CustomerChatReceiver;
