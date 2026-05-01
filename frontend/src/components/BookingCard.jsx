import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, onCancelled }) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      `Cancel booking PNR ${booking.pnr}? This will restore ${booking.seatsBooked} seat(s).`
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      await api.put(`/bookings/${booking._id}/cancel`);
      toast.success('Booking cancelled successfully');
      onCancelled(booking._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const isCancelled = booking.status === 'cancelled';

  return (
    <div className={`relative bg-white rounded-xl shadow-md border ${isCancelled ? 'border-red-200 bg-red-50/30 opacity-75' : 'border-gray-200'} overflow-hidden transition-all hover:shadow-lg mb-4 flex flex-col md:flex-row`}>
      
      {/* Left part of ticket: Train details */}
      <div className={`p-5 flex-1 ${isCancelled ? 'border-r-red-200' : 'border-r-gray-200 border-dashed md:border-r-2'} relative`}>
        {/* Cutout circles for ticket effect */}
        <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border-b border-l border-gray-200"></div>
        <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border-t border-l border-gray-200"></div>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-1 text-xs font-bold tracking-wider rounded-md uppercase ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {booking.status}
              </span>
              <span className="text-sm font-mono text-gray-500">PNR: <strong className="text-gray-800">{booking.pnr}</strong></span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{booking.train?.trainName} <span className="text-gray-400 font-normal text-sm">#{booking.train?.trainNumber}</span></h3>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-left">
            <p className="text-2xl font-bold text-gray-900">{booking.train?.departureTime}</p>
            <p className="text-sm text-gray-500 font-medium">{booking.train?.source}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-400 mb-1">{booking.journeyDate}</p>
            <div className="w-full border-t-2 border-dotted border-gray-300 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                🚂
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{booking.train?.arrivalTime}</p>
            <p className="text-sm text-gray-500 font-medium">{booking.train?.destination}</p>
          </div>
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Passenger</p>
            <p className="font-semibold text-gray-800">{booking.passengerName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{booking.passengerAge} yrs, {booking.passengerGender}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Seats</p>
            <p className="font-semibold text-gray-800">{booking.seatsBooked}</p>
          </div>
        </div>
      </div>

      {/* Right part of ticket: Fare and Actions */}
      <div className={`p-5 md:w-48 flex flex-col justify-center items-center ${isCancelled ? 'bg-red-50/50' : 'bg-blue-50/30'}`}>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Fare</p>
        <p className="text-2xl font-extrabold text-blue-700 mb-4">₹{booking.totalFare.toLocaleString()}</p>
        
        {/* Fake Barcode */}
        <div className="w-full h-8 flex justify-between items-center opacity-30 mb-4 px-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`bg-gray-800 h-full ${i % 2 === 0 ? 'w-1' : (i % 3 === 0 ? 'w-2' : 'w-0.5')}`}></div>
          ))}
        </div>

        {!isCancelled && (
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => window.print()}
              className="w-full py-2 px-4 rounded-lg text-sm font-medium border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 transition-colors"
            >
              🖨️ Print / Save PDF
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-2 px-4 rounded-lg text-sm font-medium border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Ticket'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
