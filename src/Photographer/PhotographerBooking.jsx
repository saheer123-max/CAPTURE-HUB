import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useGlobalContext } from '../Context/GlobalContext';

const PhotographerBooking = () => {
  const { id: photographerId } = useParams();
  const { token, backendUrl } = useGlobalContext();
  const navigate = useNavigate(); // Added for navigation

  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [eventType, setEventType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    const [startDate, endDate] = selectedDates;

    if (!eventType || !startDate || !endDate) {
      alert('❌ എല്ലാ ആവശ്യമായ ഫീൽഡുകളും നിറക്കുക.');
      return;
    }

    if (startDate >= endDate || (endDate - startDate < 1000)) {
      alert('❌ ശരിയായ തീയതി ശ്രേണി തിരഞ്ഞെടുക്കുക.');
      return;
    }

    if (!token) {
      alert('❌ ദയവായി ലോഗിൻ ചെയ്യുക.');
      return;
    }

    // ✅ 🔽 Fetch user from localStorage
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

    const payload = {
      photographerId: parseInt(photographerId),
      eventType,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      message,
      status: 'Pending',
      customerName,
    };

    console.log('Request Payload:', payload);

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
        console.error('Server Error Response:', errorData);
        alert(`❌ ${errorData.message || 'സെർവർ പിഴവ്'}`);
        return;
      }

      const data = await response.json();
      console.log('Response Data:', data);

      if (data.success) {
        alert(`✅ ${data.message || 'ബുക്കിംഗ് വിജയകരമായി അയച്ചു!'}`);
        setMessage('');
        setEventType('');
        // Navigate to Customer component with bookingStatus
        navigate('/customer', { state: { bookingStatus: 'Pending' } });
      } else {
        alert(`❌ ${data.message || 'ബുക്കിംഗ് പരാജയപ്പെട്ടു'}`);
      }
    } catch (err) {
      console.error('Booking Error:', err);
      alert('❌ നെറ്റ്‌വർക്ക് പിഴവ്.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">📅 ബുക്കിംഗ് റേഞ്ച് തിരഞ്ഞെടുക്കുക</h2>

        <Calendar
          onChange={(dates) => {
            console.log('📅 Selected Dates:', dates);
            setSelectedDates(dates);
          }}
          value={selectedDates}
          selectRange={true}
          minDate={new Date()}
        />

        <select
          className="w-full mt-4 border p-2 rounded"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
        >
          <option value="">ഇവന്റ് തരം തിരഞ്ഞെടുക്കുക</option>
          <option value="Wedding">വിവാഹം</option>
          <option value="Birthday">ജന്മദിനം</option>
          <option value="Engagement">നിശ്ചയം</option>
          <option value="Other">മറ്റുള്ളവ</option>
        </select>

        <textarea
          className="w-full mt-4 border p-2 rounded"
          placeholder="ബുക്കിംഗ് വിവരങ്ങൾ ചേർക്കുക..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleBooking}
          disabled={loading || !eventType || !message}
        >
          {loading ? 'അയയ്ക്കുന്നു...' : 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക'}
        </button>
      </div>
    </div>
  );
};

export default PhotographerBooking;