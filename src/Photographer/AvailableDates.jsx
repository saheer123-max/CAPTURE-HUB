import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AvailableDates = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    return availableDates.some(selectedDate => 
      formatDate(selectedDate) === formatDate(date)
    );
  };

  const isDatePast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const toggleDate = (date) => {
    if (!date || isDatePast(date)) return;
    
    const dateStr = formatDate(date);
    const isSelected = availableDates.some(selectedDate => 
      formatDate(selectedDate) === dateStr
    );
    
    if (isSelected) {
      setAvailableDates(availableDates.filter(selectedDate => 
        formatDate(selectedDate) !== dateStr
      ));
    } else {
      setAvailableDates([...availableDates, date]);
    }
  };

  const removeDate = (dateToRemove) => {
    setAvailableDates(availableDates.filter(date => 
      formatDate(date) !== formatDate(dateToRemove)
    ));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const clearAllDates = () => {
    setAvailableDates([]);
  };

  const saveAvailability = async () => {
    if (availableDates.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one available date.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: `Successfully saved ${availableDates.length} available dates!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save availability. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Manage Available Dates</h2>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
          {availableDates.length} date(s) selected
        </span>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <Calendar size={16} />
                {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
              </button>
              
              {availableDates.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllDates}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  disabled={loading}
                >
                  Clear All
                </button>
              )}
            </div>

            {showCalendar && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <h3 className="text-lg font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => {
                    if (!date) {
                      return <div key={index} className="h-10"></div>;
                    }

                    const isSelected = isDateSelected(date);
                    const isPast = isDatePast(date);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleDate(date)}
                        disabled={isPast || loading}
                        className={`h-10 text-sm rounded-lg transition-colors font-medium ${
                          isPast
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                            : isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            : 'hover:bg-gray-200 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>• <strong>Click on dates</strong> to select/deselect availability</p>
                    <p>• <strong>Past dates</strong> are disabled and cannot be selected</p>
                    <p>• <strong>Selected dates</strong> will appear in the summary panel</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Dates Panel */}
        <div className="lg:col-span-1">
          <div className="border border-gray-300 rounded-lg p-4 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Selected Dates
            </h3>

            {availableDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No dates selected yet</p>
                <p className="text-xs mt-1">Click on calendar dates to add them</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableDates
                  .sort((a, b) => a - b)
                  .map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDate(date)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-colors"
                        disabled={loading}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {availableDates.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={saveAvailability}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Availability
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableDates;