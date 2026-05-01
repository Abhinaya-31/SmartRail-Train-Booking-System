import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import BookingCard from '../components/BookingCard';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelled = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const filtered = bookings.filter((b) => {
    if (filter === 'confirmed') return b.status === 'confirmed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="text-3xl mb-2 animate-pulse">📋</div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">My Bookings</h1>
        <div className="text-sm text-gray-500">
          {confirmedCount} active · {cancelledCount} cancelled
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <div className="text-5xl mb-3">🎫</div>
          <p className="font-medium text-gray-600">No bookings yet</p>
          <p className="text-sm mt-1">Search for trains and book your first ticket!</p>
          <a href="/search" className="inline-block btn-primary mt-4 text-sm">
            Search Trains
          </a>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
            {['all', 'confirmed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm rounded-md font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No {filter} bookings found</p>
            ) : (
              filtered.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancelled={handleCancelled}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookings;
