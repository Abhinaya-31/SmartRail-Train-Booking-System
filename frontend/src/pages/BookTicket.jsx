import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BookTicket = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const train = state?.train;
  const journeyDate = state?.journeyDate;

  const [form, setForm] = useState({
    passengerName: user?.name || '',
    passengerAge: '',
    passengerGender: 'Male',
    seatsBooked: 1,
  });
  const [loading, setLoading] = useState(false);

  if (!train || !journeyDate) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-gray-500">
        <p>Invalid booking attempt. Please go back and select a train.</p>
        <button onClick={() => navigate('/search')} className="btn-primary mt-4">
          Back to Search
        </button>
      </div>
    );
  }

  const baseFare = form.seatsBooked * train.fare;
  const taxes = Math.round(baseFare * 0.05); // 5% GST
  const totalFare = baseFare + taxes;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/bookings', {
        trainId: id,
        journeyDate,
        seatsBooked: parseInt(form.seatsBooked),
        passengerName: form.passengerName.trim(),
        passengerAge: parseInt(form.passengerAge),
        passengerGender: form.passengerGender,
      });

      toast.success(`Booking confirmed! PNR: ${data.pnr}`);
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Back to results
      </button>

      <h1 className="page-title mb-6">Book Your Ticket</h1>

      {/* Train summary */}
      <div className="card p-5 mb-6 bg-blue-50 border-blue-200">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{train.trainName}</h2>
            <p className="text-sm text-gray-500 font-mono">#{train.trainNumber}</p>
            <div className="flex items-center gap-2 mt-2 text-gray-700">
              <span className="font-medium">{train.source}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium">{train.destination}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Departure</p>
            <p className="text-2xl font-bold text-blue-700">{train.departureTime}</p>
            <p className="text-sm text-gray-500 mt-1">
              📅 {journeyDate}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-200 flex gap-4 text-sm text-gray-600">
          <span>Arrives: <strong>{train.arrivalTime}</strong></span>
          <span>Available: <strong className="text-green-700">{train.availableSeats} seats</strong></span>
          <span>Fare: <strong>₹{train.fare}/seat</strong></span>
        </div>
      </div>

      {/* Booking form */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Passenger Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Passenger Name</label>
            <input
              type="text"
              name="passengerName"
              value={form.passengerName}
              onChange={handleChange}
              className="form-input"
              placeholder="Full name as on ID"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                name="passengerAge"
                value={form.passengerAge}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 25"
                min="1"
                max="120"
                required
              />
            </div>
            <div>
              <label className="form-label">Gender</label>
              <select
                name="passengerGender"
                value={form.passengerGender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Number of Seats</label>
            <select
              name="seatsBooked"
              value={form.seatsBooked}
              onChange={handleChange}
              className="form-input"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n} disabled={n > train.availableSeats}>
                  {n} {n === 1 ? 'seat' : 'seats'}{n > train.availableSeats ? ' (unavailable)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Base Fare ({form.seatsBooked} {form.seatsBooked === 1 ? 'seat' : 'seats'})</span>
              <span>₹{baseFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Taxes & Fees (5% GST)</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total Amount</span>
              <span className="text-blue-700">₹{totalFare.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
            {loading ? 'Booking...' : `Confirm Booking — ₹${totalFare.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTicket;
