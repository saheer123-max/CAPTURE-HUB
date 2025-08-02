import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../Context/GlobalContext'; // 🔁 context path verify ചെയ്യൂ

function Booking() {
  const [activeTab, setActiveTab] = useState('Bookings');
  const [bookings, setBookings] = useState([]);
  const { token, backendUrl } = useGlobalContext();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/booking/request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && Array.isArray(res.data.data)) {
          setBookings(res.data.data); // ✅ correct structure
        } else {
          console.error('Unexpected data:', res.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [backendUrl, token]);

  const handleAccept = async (id) => {
    try {
      console.log("booking id"+id);
      
      await axios.put(`${backendUrl}/api/booking/${id}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'Accepted' } : b
        )
      );
    } catch (err) {
      console.error('Accept Error:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/booking/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'Rejected' } : b
        )
      );
    } catch (err) {
      console.error('Reject Error:', err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Bookings':
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
                      <p
                        className={`text-sm ${
                          booking.status === 'Pending'
                            ? 'text-yellow-400'
                            : booking.status === 'Accepted'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        Status: {booking.status}
                      </p>
                      {/* Add API links for bookings with ID 17 and 18 */}
                      {booking.id === 17 && (
                        <p className="text-sm text-blue-400">
                          API: <a href="https://localhost:7037/api/booking/17/accept" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Accept Link</a>
                        </p>
                      )}
                      {booking.id === 18 && (
                        <p className="text-sm text-blue-400">
                          API: <a href="https://localhost:7037/api/booking/18/reject" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Reject Link</a>
                        </p>
                      )}
                    </div>
                    {booking.status === 'Pending' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAccept(booking.id)}
                          className="bg-green-600 px-4 py-1 rounded-full"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
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

      case 'Messages':
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
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

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}

export default Booking;