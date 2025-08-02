import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import {
  AlertCircle,
  CheckCircle,
  Camera,
  DollarSign,
  FileText,
  Type,
  Clock,
  Package,
  Phone,
  ToggleLeft,
  Star
} from 'lucide-react';

const AddService = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [baseCost, setBaseCost] = useState('');
  const [extraHourCost, setExtraHourCost] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [userId, setUserId] = useState(null)
  const [additionalServices, setAdditionalServices] = useState({
    videography: { selected: false, price: '' },
    editing: { selected: false, price: '' },
    droneShot: { selected: false, price: '' },
    liveStream: { selected: false, price: '' }
  });
  const [isAvailable, setIsAvailable] = useState(true);
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [photographerProfileId, setPhotographerProfileId] = useState(null);

  const serviceTypes = [
    { value: 'wedding', label: '💒 Wedding Photography' },
    { value: 'reels', label: '🎬 Reels Creation' },
    { value: 'business', label: '💼 Business Related' },
    { value: 'birthday', label: '🎂 Birthday Photoshoot' },
    { value: 'portrait', label: '👤 Portrait Photography' },
    { value: 'event', label: '🎉 Event Photography' },
    { value: 'product', label: '📦 Product Photography' },
    { value: 'maternity', label: '🤱 Maternity Shoot' }
  ];

  // Decode JWT token to get photographerProfileId
useEffect(() => {
  const token = localStorage.getItem('token');
  console.log("TOKEN:", token);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("✅ Token loaded & currentUser set:", decoded);

      // ✅ ഇവിടെ proper claim URI ഉപയോഗിച്ച് id എടുക്കണം
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      setUserId(id);
      console.log("📌 Extracted UserId:", id);
      

    } catch (error) {
      console.error('Token decode ചെയ്യുമ്പോള്‍ പിഴവ്:', error);
      setMessage({ type: 'error', text: 'തെറ്റായ ടോക്കണ്‍. ദയവായി വീണ്ടും login ചെയ്യൂ.' });
    }
  } else {
    setMessage({ type: 'error', text: 'അനധികൃത ആക്സസ്. ദയവായി login ചെയ്യൂ.' });
  }
}, []);


  useEffect(() => {
  if (userId) {
    const fetchProfile = async () => {
      try {
      const response = await fetch(`https://localhost:7037/api/Photographer/by-user/${userId}`);

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("📸 Photographer Profile Fetched:", data.data);
          setPhotographerProfileId(data.data.id); // photographerProfileId set ചെയ്യുന്നു
        } else {
          console.error("⚠️ Unable to fetch profile:", data.message);
          setMessage({ type: 'error', text: 'Profile not found. Please complete your photographer profile.' });
        }
      } catch (err) {
        console.error("📡 Network Error:", err);
        setMessage({ type: 'error', text: 'Network error while fetching profile.' });
      }
    };

    fetchProfile(); // ✅ function call
  }
}, [userId]);


  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'Unauthorized. Please login first.' });
      setLoading(false);
      return;
    }

 if (!userId) {
   setMessage({ type: 'error', text: 'User ID not found. Please login again.' });
   setLoading(false);
   return;
}

   const payload = {
    photographerProfileId: photographerProfileId,

  serviceName,
  description,
  serviceType,
  baseCost: parseInt(baseCost),
  extraHourCost: parseInt(extraHourCost),
  minimumAmount: parseInt(minimumAmount),
 
  contactNumber,
  isAvailable,
  videographyPrice: additionalServices.videography.selected
    ? parseInt(additionalServices.videography.price || '0')
    : 0,
  editingPrice: additionalServices.editing.selected
    ? parseInt(additionalServices.editing.price || '0')
    : 0,
  droneShotPrice: additionalServices.droneShot.selected
    ? parseInt(additionalServices.droneShot.price || '0')
    : 0,
  liveStreamPrice: additionalServices.liveStream.selected
    ? parseInt(additionalServices.liveStream.price || '0')
    : 0,

};


console.log("📦 Payload before sending:", payload);
console.log(payload, typeof payload.photographerProfileId);


    try {
      const response = await fetch('https://localhost:7037/api/Photographer/add-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Service added successfully!' });
        setServiceName('');
        setDescription('');
        setServiceType('');
        setBaseCost('');
        setExtraHourCost('');
        setMinimumAmount('');
        setAdditionalServices({
          videography: { selected: false, price: '' },
          editing: { selected: false, price: '' },
          droneShot: { selected: false, price: '' },
          liveStream: { selected: false, price: '' }
        });
        setIsAvailable(true);
        setContactNumber('');
      } else {
        throw new Error(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const formatContactNumber = (value) => value.replace(/[^\d]/g, '');
  const handleContactChange = (e) => {
    const formattedNumber = formatContactNumber(e.target.value);
    if (formattedNumber.length <= 10) setContactNumber(formattedNumber);
  };

  const formatPrice = (value) => value.replace(/[^\d.]/g, '');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Add Photography Service</h2>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Type size={16} /> Service Name
            </label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Premium Wedding Package"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required disabled={loading} />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Star size={16} /> Service Type
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required disabled={loading}>
              <option value="">Select Service Type</option>
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText size={16} /> Description
          </label>
          <textarea rows={4} placeholder="Service details"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required disabled={loading} />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Base Cost (4 Hrs)" icon={<DollarSign size={16} />}
            value={baseCost} onChange={e => setBaseCost(formatPrice(e.target.value))} loading={loading} />
          <InputField label="Extra Per Hour" icon={<Clock size={16} />}
            value={extraHourCost} onChange={e => setExtraHourCost(formatPrice(e.target.value))} loading={loading} />
          <InputField label="Minimum Amount" icon={<DollarSign size={16} />}
            value={minimumAmount} onChange={e => setMinimumAmount(formatPrice(e.target.value))} loading={loading} />
        </div>

  
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Package size={16} /> Additional Services (Optional)
          </label>
          <div className="grid grid-cols-1 gap-3">
            {['videography', 'editing', 'droneShot', 'liveStream'].map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={additionalServices[key].selected}
                    onChange={() => setAdditionalServices((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], selected: !prev[key].selected }
                    }))}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700 capitalize">{key.replace('Shot', ' Shot').replace('Stream', ' Stream')}</span>
                </label>
                {additionalServices[key].selected && (
                  <input type="number"
                    placeholder={`Enter ${key} price (₹)`}
                    value={additionalServices[key].price}
                    onChange={(e) => setAdditionalServices((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], price: formatPrice(e.target.value) }
                    }))}
                    className="ml-6 mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading} min="0" />
                )}
              </div>
            ))}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Contact Number" icon={<Phone size={16} />}
            type="tel" value={contactNumber} onChange={handleContactChange} loading={loading} maxLength="10" />
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ToggleLeft size={16} /> Availability
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="availability" checked={isAvailable}
                  onChange={() => setIsAvailable(true)} disabled={loading}
                  className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700"> Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="availability" checked={!isAvailable}
                  onChange={() => setIsAvailable(false)} disabled={loading}
                  className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700"> Not Available</span>
              </label>
            </div>
          </div>
        </div>


        <button type="button" onClick={handleSubmit} disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            loading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Adding Service...
            </>
          ) : (
            <>
              <Camera size={18} /> Add Service
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, type = 'number', value, onChange, loading, maxLength }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      {icon} {label}
    </label>
    <input type={type}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={onChange}
      required disabled={loading} maxLength={maxLength} />
  </div>
);

export default AddService;