  import React, { useState, useEffect, useRef } from 'react';
  import * as signalR from '@microsoft/signalr';
  import { jwtDecode } from "jwt-decode";
  import { useLocation } from 'react-router-dom';
    
  import { useUser } from "../Contexts/UserContext";
  function Chat({ isCustomer }) {
    
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isConnected, setIsConnected] = useState(false);
  const { currentUser, setCurrentUser } = useUser();
    const [targetUser, setTargetUser] = useState(null);
    const messagesEndRef = useRef(null);
    const location = useLocation();
  
  

    // ✅ Set targetUser from navigation
    useEffect(() => {
      if (location.state?.targetUser) {
        setTargetUser(location.state.targetUser);
        console.log("✅ Target User set from navigation:", location.state.targetUser);
      }
    }, [location.state]);

    // ✅ Set currentUser from token
    useEffect(() => {
      
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const user = {
          id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };
        setCurrentUser(user);
        console.log("✅ Current User from token:", user);
          setCurrentUser(user); // ✅ Global context-ൽ set
      console.log("✅ Set currentUser in context:", user);
      }
    }, []);

    // ✅ Debug log
    useEffect(() => {
      console.log("✅ Current User:", currentUser);
      console.log("✅ Target User:", targetUser);
    }, [currentUser, targetUser]);

    // ✅ Scroll to bottom on new message
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ✅ Setup SignalR
    useEffect(() => {
      if (!currentUser || !targetUser) return;

      let intervalId;

      const connectToSignalR = () => {
        const token = localStorage.getItem('token');

        if (token) {
          console.log("✅ JWT token found. Connecting...");

          const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7037/chathub", {
              accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

          setConnection(newConnection);

          newConnection
            .start()
            .then(() => {
              console.log('✅ SignalR ചാറ്റ് കണക്ഷൻ സജ്ജമാണ്!');
              setIsConnected(true);

              newConnection.on("ReceiveMessage", (senderId, message) => {
                if (senderId === targetUser.id) {
                  const msg = {
                    id: Date.now(),
                    text: message,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                    sender: isCustomer ? 'photographer' : 'customer',
                  };
                  setMessages(prev => [...prev, msg]);
                }
              });
            })
            .catch(err => {
              console.error("❌ SignalR കണക്ഷൻ പിശക്:", err);
            });

          clearInterval(intervalId);
        } else {
          console.warn("⛔ JWT token not found. Retrying...");
        }
      };

      intervalId = setInterval(connectToSignalR, 500);

      return () => {
        clearInterval(intervalId);
        if (connection) connection.stop();
      };
    }, [currentUser, targetUser]);

  const sendMessage = async () => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      text.trim()
    ) {
      try {
        await connection.invoke("SendMessage", targetUser.id.toString(), text); // ✅ correct usage

        const reply = {
          id: Date.now(),
          text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          sender: isCustomer ? 'customer' : 'photographer'
        };

        setMessages(prev => [...prev, reply]);
        setText('');
      } catch (e) {
        console.error("❌ മെസ്സേജ് അയക്കാനായില്ല:", e);
      }
    } else {
      console.warn("❌ Connection not ready or message is empty.");
    }
  };



    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
      <div className="flex flex-col h-96 max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">
            Chat with {targetUser?.name || 'User'}
          </h2>
          <div className="text-xs">{isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === (isCustomer ? 'customer' : 'photographer') ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === (isCustomer ? 'customer' : 'photographer')
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <div className="text-xs font-medium mb-1 opacity-75">{msg.sender}</div>
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-[10px] mt-1 text-right text-gray-500">{msg.timestamp}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim() || !isConnected}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default Chat;
