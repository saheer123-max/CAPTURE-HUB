import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarStyles.css'; 
import { useGlobalContext } from '../Context/GlobalContext';

const PhotographerBooking = () => {
  const { id: photographerId } = useParams();
  const { token, backendUrl } = useGlobalContext();
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [eventType, setEventType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [approvedDates, setApprovedDates] = useState([]); 


  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/booking/approved/${photographerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const allDates = [];
          data.data.forEach((booking) => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            for (
              let date = new Date(start);
              date <= end;
              date.setDate(date.getDate() + 1)
            ) {
              allDates.push(new Date(date));
            }
          });
          setApprovedDates(allDates);
        }
      } catch (error) {
        console.error(' Approved booking fetch error:', error);
      }
    };
    fetchApproved();
  }, [photographerId, backendUrl, token]);


  const handleBooking = async () => {
    const [startDate, endDate] = selectedDates;

  if (!eventType || !startDate || !endDate) {
  alert(' Please fill in all required fields.');
  return;
}

if (startDate >= endDate || (endDate - startDate < 1000)) {
  alert(' Please select a valid date range.');
  return;
}

if (!token) {
  alert(' Please log in.');
  return;
}


    const storedUser = localStorage.getItem('user');
    let customerName = '';
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        customerName = user.name || '';
      } catch (err) {
        console.error('❌ user parse error:', err);
      }
    }

    const adjustedStart = new Date(startDate);
    adjustedStart.setHours(12, 0, 0, 0);

    const adjustedEnd = new Date(endDate);
    adjustedEnd.setHours(23, 59, 59, 999);

    const payload = {
      photographerId: parseInt(photographerId),
      eventType,
      startDate: adjustedStart.toISOString(),
      endDate: adjustedEnd.toISOString(),
      message,
      status: 'Pending',
      customerName,
    };

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/booking/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ ${errorData.message || 'Server Erorr'}`);
        return;
      }

const data = await response.json();
if (data.success) {
  console.log("📦 Booking ID sent:", data.id); // ✅ Confirming received booking ID
  alert(data.message || 'Booking sent successfully!');
  localStorage.setItem("bookingId", data.id); // ✅ store it correctly
  navigate('/customer-status');
}

 else {
  alert(` ${data.message || 'Booking failed'}`);
}
} catch (err) {
  console.error(' Booking Error:', err);
  alert(' Network error.');
} finally {
  setLoading(false);
}

  };

  // ✅ Highlight approved dates
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      if (approvedDates.some((d) => d.toDateString() === dateStr)) {
        return 'approved-date';
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">📅 Select Booking Range</h2>


        <Calendar
          onChange={(dates) => setSelectedDates(dates)}
          value={selectedDates}
          selectRange={true}
          minDate={new Date()}
          tileClassName={tileClassName} 
        />

        <select
          className="w-full mt-4 border p-2 rounded"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
        >
      <option value="">Select Event Type</option>
<option value="Wedding">Wedding</option>
<option value="Birthday">Birthday</option>
<option value="Engagement">Engagement</option>
<option value="Other">Other</option>

        </select>

        <textarea
          className="w-full mt-4 border p-2 rounded"
          placeholder="Booking details..."

          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleBooking}
          disabled={loading || !eventType || !message}
        >
       {loading ? 'Sending...' : 'Book Now'}

        </button>
      </div>
    </div>
  );
};

export default PhotographerBooking;
