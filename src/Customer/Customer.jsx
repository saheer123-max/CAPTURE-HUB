import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function Customer() {
  const bookingId = localStorage.getItem('bookingId');
  const token = localStorage.getItem('token');
  const backendUrl = 'https://localhost:7037';

  const [status, setStatus] = useState('Fetching...');

  // ✅ Step 1: Directly fetch status from backend
  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/booking/${bookingId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStatus(data.status);
      } catch (err) {
        console.error("❌ Status fetch failed", err);
        setStatus("Error");
      }
    };

    if (bookingId && token) {
      fetchBookingStatus();
    }
  }, [bookingId, token]);

  // ✅ Step 2: Real-time update using SignalR
  useEffect(() => {
    if (!bookingId || !token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendUrl}/bookinghub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("🔗 SignalR connected");
        connection.invoke("SubscribeToBooking", bookingId.toString());
      })
      .catch((err) => console.error("❌ SignalR error:", err));

    connection.on("ReceiveBookingStatusUpdate", (updatedBookingId, newStatus) => {
      if (updatedBookingId === bookingId) {
        setStatus(newStatus);
        console.log("🔄 Real-time status updated:", newStatus);
      }
    });

    return () => {
      connection.stop();
    };
  }, [bookingId, token]);

  const getStatusStyle = () => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Fetching...':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">📸 Booking Status</h2>
        <p className="text-lg mb-2">
          Your booking is currently{' '}
          <span className={`font-semibold ${getStatusStyle()}`}>{status}</span>.
        </p>

        {/* ✅ Booking ID Show Here */}
        {bookingId && (
          <p className="text-sm text-gray-500">
            Booking ID: <span className="font-medium">{bookingId}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Customer;
