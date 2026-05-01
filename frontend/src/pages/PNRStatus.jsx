import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PNRStatus = () => {
  const [pnrNumber, setPnrNumber] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pnrNumber.trim()) {
      toast.error('Please enter a valid PNR number');
      return;
    }

    setLoading(true);
    setSearched(true);
    setBooking(null);

    try {
      const { data } = await api.get(`/bookings/pnr/${pnrNumber.trim().toUpperCase()}`);
      setBooking(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PNR not found or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
      <div className="text-center mb-10">
        <h1 className="page-title mb-3">PNR Status Check</h1>
        <p className="text-gray-500">Enter your booking PNR number to check booking details and status.</p>
      </div>

      <div className="card p-6 md:p-8 bg-white shadow-xl shadow-blue-900/5 mb-8 border-t-4 border-t-blue-600">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter PNR Number (e.g. PNR1234567890)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg uppercase transition-all"
            value={pnrNumber}
            onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
            maxLength={20}
            required
          />
          <button
            type="submit"
            className="btn-primary py-3 px-8 text-lg whitespace-nowrap"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}

      {!loading && searched && !booking && (
        <div className="text-center py-10 card bg-red-50 border-red-100">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800">No Booking Found</h3>
          <p className="text-gray-600 mt-2">Please verify your PNR number and try again.</p>
        </div>
      )}

      {booking && (
        <div className="card overflow-hidden border border-gray-200 shadow-sm animate-fade-in">
          <div className={`p-4 border-b flex justify-between items-center ${booking.status === 'cancelled' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <div>
              <span className="text-sm font-medium text-gray-500">Booking Status</span>
              <div className={`text-xl font-bold uppercase ${booking.status === 'cancelled' ? 'text-red-700' : 'text-green-700'}`}>
                {booking.status}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-500">PNR Number</span>
              <div className="text-xl font-bold font-mono tracking-wider text-gray-900">{booking.pnr}</div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Passenger Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{booking.passengerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seats Booked</p>
                <p className="font-semibold text-gray-900">{booking.seatsBooked} Seat(s)</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Journey Details</h3>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 text-6xl">
                🚂
              </div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h4 className="font-bold text-blue-800 text-lg">{booking.train.trainName}</h4>
                  <p className="text-gray-500 font-mono text-sm">Train #{booking.train.trainNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{booking.journeyDate}</p>
                  <p className="text-gray-500 text-sm">Date of Journey</p>
                </div>
              </div>

              <div className="flex justify-between items-center relative z-10 pt-4 border-t border-gray-200">
                <div className="w-1/3">
                  <p className="text-2xl font-bold text-gray-900">{booking.train.departureTime}</p>
                  <p className="font-medium text-gray-600">{booking.train.source}</p>
                </div>
                
                <div className="w-1/3 flex flex-col items-center">
                  <span className="text-gray-400 text-sm mb-1">---------- 🚂 ----------</span>
                </div>
                
                <div className="w-1/3 text-right">
                  <p className="text-2xl font-bold text-gray-900">{booking.train.arrivalTime}</p>
                  <p className="font-medium text-gray-600">{booking.train.destination}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PNRStatus;
