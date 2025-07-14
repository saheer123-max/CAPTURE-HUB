import React, { useState } from 'react';
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

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      serviceName,
      description,
      serviceType,
      baseCost: parseInt(baseCost),
      extraHourCost: parseInt(extraHourCost),
      minimumAmount: parseInt(minimumAmount),
      contactNumber,
      isAvailable,
      videographyPrice: additionalServices.videography.selected ? parseInt(additionalServices.videography.price) : 0,
      editingPrice: additionalServices.editing.selected ? parseInt(additionalServices.editing.price) : 0,
      droneShotPrice: additionalServices.droneShot.selected ? parseInt(additionalServices.droneShot.price) : 0,
      liveStreamPrice: additionalServices.liveStream.selected ? parseInt(additionalServices.liveStream.price) : 0,
      photographerProfileId: 3 // ✅ Use correct ID from your backend DB
    };

    try {
      const response = await fetch('https://localhost:7037/api/Photographer/add-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
        {/* Service Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Type size={16} /> Service Name
            </label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Premium Wedding Package"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required disabled={loading} />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Star size={16} /> Service Type
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2"
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

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText size={16} /> Description
          </label>
          <textarea rows={4} placeholder="Service details"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required disabled={loading} />
        </div>

        {/* Cost Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Base Cost (4 Hrs)" icon={<DollarSign size={16} />}
            value={baseCost} onChange={e => setBaseCost(formatPrice(e.target.value))} loading={loading} />
          <InputField label="Extra Per Hour" icon={<Clock size={16} />}
            value={extraHourCost} onChange={e => setExtraHourCost(formatPrice(e.target.value))} loading={loading} />
          <InputField label="Minimum Amount" icon={<DollarSign size={16} />}
            value={minimumAmount} onChange={e => setMinimumAmount(formatPrice(e.target.value))} loading={loading} />
        </div>

        {/* Additional Services */}
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
                  <span className="text-sm text-gray-700">{key}</span>
                </label>
                {additionalServices[key].selected && (
                  <input type="number"
                    placeholder={`Enter ${key} price (₹)`}
                    value={additionalServices[key].price}
                    onChange={(e) => setAdditionalServices((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], price: formatPrice(e.target.value) }
                    }))}
                    className="ml-6 mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    disabled={loading} min="0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Availability */}
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
                <span className="text-sm text-gray-700">✅ Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="availability" checked={!isAvailable}
                  onChange={() => setIsAvailable(false)} disabled={loading}
                  className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700">❌ Not Available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
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
      className="w-full border border-gray-300 rounded-lg px-3 py-2"
      value={value}
      onChange={onChange}
      required disabled={loading} maxLength={maxLength} />
  </div>
);

export default AddService;
