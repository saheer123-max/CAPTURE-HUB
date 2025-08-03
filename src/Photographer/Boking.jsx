// Booking.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../Context/GlobalContext';
import { useNavigate } from 'react-router-dom';

function Booking() {
  const [activeTab, setActiveTab] = useState('Bookings');
  const [bookings, setBookings] = useState([]);
  const { token, backendUrl } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/booking/request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && Array.isArray(res.data.data)) {
          setBookings(res.data.data);
        } else {
          console.error('Unexpected data:', res.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [backendUrl, token]);

const handleAccept = async (id, userId) => {
  console.log("🟢 Booking Accept ചെയ്യാൻ ശ്രമിക്കുന്നു");
  console.log("➡️ Booking ID:", id);
  console.log("➡️ User ID:", userId);

  try {
    const acceptResponse = await axios.put(`${backendUrl}/api/booking/${id}/accept`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Booking Accept API Response:", acceptResponse.data);

    // ✅ Notify customer in backend via SignalR
    const notifyResponse = await axios.post(`${backendUrl}/api/notify/customer`, {
      bookingId: id,
      userId: userId,
      status: "Accepted",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log("📢 Notify API Response:", notifyResponse.data);

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Accepted' } : b))
    );
  } catch (err) {
    console.error('❌ Accept Error:', err.response?.data || err.message);
  }
};


  const handleReject = async (id, userId) => {
    try {
      await axios.put(`${backendUrl}/api/booking/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.post(`${backendUrl}/api/notify/customer`, {
        bookingId: id,
        userId: userId,
        status: "Rejected",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Rejected' } : b))
      );
    } catch (err) {
      console.error('Reject Error:', err);
    }
  };

  const renderContent = () => {
    if (activeTab === 'Bookings') {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-6">Booking Requests</h2>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-gray-400">No booking requests found.</p>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      Customer: {booking.customerName || `User ID ${booking.userId}`}
                    </h3>
                    <p className="text-gray-400">
                      Date: {new Date(booking.startDate).toLocaleDateString()} | Event: {booking.eventType}
                    </p>
                    <p className="text-sm text-gray-500">Message: {booking.message}</p>
                    <p className={`text-sm ${
                      booking.status === 'Pending' ? 'text-yellow-400' :
                      booking.status === 'Accepted' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      Status: {booking.status}
                    </p>
                  </div>
                  {booking.status === 'Pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAccept(booking.id, booking.userId)}
                        className="bg-green-600 px-4 py-1 rounded-full"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(booking.id, booking.userId)}
                        className="bg-red-600 px-4 py-1 rounded-full"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'Messages') {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-4">Messages</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p><strong>Customer 1:</strong> Hi, are you available on Jan 5th?</p>
            <input
              type="text"
              placeholder="Reply..."
              className="w-full mt-2 p-2 rounded bg-gray-700"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('Bookings')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'Bookings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('Messages')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'Messages'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Messages
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default Booking;
