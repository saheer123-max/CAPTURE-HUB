// CustomerStatus.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';

function Customer() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const initialStatus = location.state?.bookingStatus || 'Pending';

  const [status, setStatus] = useState(initialStatus);
  const token = localStorage.getItem('token');
  const backendUrl = 'https://localhost:7037';

  useEffect(() => {
   
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendUrl}/bookinghub`) 
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("🔗 SignalR connected");

        connection.invoke("SubscribeToBooking", bookingId);
      })
      .catch(err => console.error('SignalR connection error:', err));

   
    connection.on("ReceiveBookingStatusUpdate", (updatedBookingId, newStatus) => {
      if (updatedBookingId === bookingId) {
        setStatus(newStatus);
        console.log("🔄 Real-time status updated:", newStatus);
      }
    });

    return () => {
     
      connection.stop();
    };
  }, [bookingId]);

  const getStatusStyle = () => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">📸 Booking Status</h2>
        <p className="text-lg">
          Your booking is currently{' '}
          <span className={`font-semibold ${getStatusStyle()}`}>{status}</span>.
        </p>
      </div>
    </div>
  );
}

export default Customer;
