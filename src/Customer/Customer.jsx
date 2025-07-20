import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../Context/GlobalContext';

function Customer() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const initialStatus = location.state?.bookingStatus || 'Pending';

  const { backendUrl, token } = useGlobalContext();
  const [status, setStatus] = useState(initialStatus);

  // 🔁 Booking status regular check cheyyunnu
  useEffect(() => {
    const fetchBookingStatus = () => {
      if (bookingId) {
        axios
          .get(`${backendUrl}/api/booking/${bookingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setStatus(res.data.status); // ⏫ backend booking status
          })
          .catch((err) => {
            console.error('❌ Booking status fetch failed:', err);
          });
      }
    };

    // 🔁 5 second interval
    const interval = setInterval(fetchBookingStatus, 5000);
    fetchBookingStatus(); // immediate first call
    return () => clearInterval(interval); // cleanup
  }, [bookingId, backendUrl, token]);

  // 🌈 Text color change based on status
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
