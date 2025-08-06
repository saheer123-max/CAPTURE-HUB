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

  useEffect(() => {
    if (currentUser?.id) {
      setPhotographerId(currentUser.id);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setPhotographerId(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const savedUser = localStorage.getItem('selectedTargetUser');
    const savedCustomers = localStorage.getItem('chatCustomers');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setTargetUser(parsedUser);
      setCustomerId(parsedUser.id);
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  useEffect(() => {
    if (targetUser) {
      localStorage.setItem('selectedTargetUser', JSON.stringify(targetUser));
    }
  }, [targetUser]);

  useEffect(() => {
    localStorage.setItem('chatCustomers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (targetUser?.id && photographerId) {
      setCustomerId(targetUser.id);

      fetch(`https://localhost:7037/api/Photographer/api/messages/${targetUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const formattedMessages = data.map((msg) => {
            let parsedDate;
            if (msg.timestamp?.includes('AM') || msg.timestamp?.includes('PM')) {
              const today = new Date().toISOString().split('T')[0];
              parsedDate = new Date(`${today} ${msg.timestamp}`);
            } else {
              parsedDate = new Date(msg.timestamp);
            }

            const isValidDate = parsedDate instanceof Date && !isNaN(parsedDate);
            const timeString = isValidDate
              ? parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Unknown Time';

          const isCustomer = parseInt(msg.fromUserId) !== parseInt(photographerId);


            return {
              id: msg.id,
              text: msg.text || msg.message || '[Text Missing]',
              sender: isCustomer ? 'customer' : 'photographer',
              timestamp: timeString,
            };
          });

          setMessages(formattedMessages);
          setAllMessages((prev) => ({
            ...prev,
            [targetUser.id]: formattedMessages,
          }));
        })
        .catch((err) => console.error('❌ Failed to fetch messages:', err));
    }
  }, [targetUser, photographerId]);

  useEffect(() => {
    if (!photographerId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7037/chathub', {
        accessTokenFactory: () => localStorage.getItem('token') || '',
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('✅ SignalR connected');
        await newConnection.invoke('JoinGroup', photographerId.toString());

       newConnection.on('ReceiveMessage', (senderId, messageObj) => {
  const parsedText = typeof messageObj === 'string'
    ? messageObj
    : typeof messageObj?.text === 'string'
      ? messageObj.text
      : '[Text Missing]';

  const parsedDate = new Date(messageObj?.timestamp || new Date());
  const timeString = isNaN(parsedDate)
    ? 'Unknown Time'
    : parsedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

  const isCustomer = parseInt(senderId) === parseInt(customerId);

  const newMsg = {
    id: Date.now(),
    text: parsedText,
    sender: isCustomer ? 'customer' : 'photographer', // ✅
    timestamp: timeString,
  };


          setCustomers((prev) => {
            const exists = prev.some((c) => c.id === parseInt(senderId));
            if (!exists) {
              return [...prev, { id: parseInt(senderId), name: `Customer ${senderId}` }];
            }
            return prev;
          });

          setAllMessages((prev) => ({
            ...prev,
            [senderId]: [...(prev[senderId] || []), newMsg],
          }));

          if (parseInt(senderId) === parseInt(customerId)) {
            setMessages((prev) => [...prev, newMsg]);
          }
        });
      } catch (error) {
        console.error('❌ Error connecting to SignalR:', error);
      }
    };

    startConnection();

    return () => {
      newConnection.stop();
    };
  }, [photographerId, customerId]);

  useEffect(() => {
    if (targetUser?.id) {
      setCustomerId(targetUser.id);
      setMessages(allMessages[targetUser.id] || []);
    }
  }, [targetUser, allMessages]);

  const sendReply = async () => {
    if (!newMessage.trim() || !connection || !photographerId || !customerId) return;

    try {
      await connection.invoke('SendMessage', photographerId.toString(), customerId.toString(), newMessage);

      const reply = {
        id: Date.now(),
        text: newMessage,
        sender: 'photographer',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setAllMessages((prev) => ({
        ...prev,
        [customerId]: [...(prev[customerId] || []), reply],
      }));

      setMessages((prev) => [...prev, reply]);
      setNewMessage('');
    } catch (error) {
      console.error('❌ Failed to send message via SignalR:', error);
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

      <div className="w-3/4 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-800/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{targetUser?.name || 'Select a Customer'}</h3>
              <p className="text-sm text-green-400">● Online</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
          {messages.map((message) => (
  <div
    key={message.id}
    className={`flex flex-col ${
      message.sender === 'customer' ? 'items-end' : 'items-start'
    }`}
  >
    <p className="text-xs font-semibold mb-1 text-gray-400">
      {message.sender === 'customer' ? 'Customer' : 'Photographer'}
    </p>

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

        <div className="p-4 border-t border-gray-700 bg-gray-800/70">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="നിന്റെ മറുപടി എഴുതുക..."
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              onClick={sendReply}
              disabled={!newMessage.trim() || !connection}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
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
