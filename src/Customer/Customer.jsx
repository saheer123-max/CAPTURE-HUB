import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function Customer() {
  const token = localStorage.getItem('token');
  const backendUrl = 'https://localhost:7037';

  const [bookingId, setBookingId] = useState(() => localStorage.getItem('bookingId'));
  const [status, setStatus] = useState(() => localStorage.getItem('bookingStatus') || 'Fetching...');



  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendUrl}/bookinghub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log('🔗 SignalR connected');

        // ✅ Receiving booking status update
        connection.on('ReceiveBookingStatusUpdate', (receivedBookingId, newStatus) => {
          console.log('📥 Booking Update => ID:', receivedBookingId, 'Status:', newStatus);

          // 👉 Update state
          setBookingId(receivedBookingId);
          setStatus(newStatus);

          // 👉 Save in localStorage
          localStorage.setItem('bookingId', receivedBookingId);
          localStorage.setItem('bookingStatus', newStatus);
        });

        // ✅ Re-join booking group if bookingId exists in localStorage
        const storedBookingId = localStorage.getItem('bookingId');
        if (storedBookingId) {
         connection.invoke('SubscribeToBooking', bookingId)
  .then(() => console.log(`✅ Subscribed to booking group: ${bookingId}`))
  .catch((err) => console.error('❌ Error subscribing to group:', err));
        }

      })
      .catch((err) => console.error('❌ SignalR connection error:', err));

    return () => {
      connection.stop();
    };
  }, [token]);

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
