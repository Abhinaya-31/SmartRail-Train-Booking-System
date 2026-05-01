import React, { useState } from 'react';
import api from '../utils/api';
import TrainCard from '../components/TrainCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchFrom || !searchTo || !searchDate) {
      toast.error('Please fill From, To, and Date');
      return;
    }

    setLoading(true);
    setSearched(false);

    try {
      const { data } = await api.get('/trains/search', {
        params: {
          source: searchFrom.trim(),
          destination: searchTo.trim(),
          date: searchDate,
        },
      });
      setTrains(data);
      setSearched(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative w-full h-[600px] md:h-[700px] bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      >
        {/* Dark Overlay Gradient matching the screenshot (dark on left fading to transparent on right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-xl">
            {/* Badge */}
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-600 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-lg shadow-blue-600/30">
              HELLO, TRAVELERS
            </span>

            {/* SmartRail Heading */}
            <h2 className="text-blue-400 font-bold tracking-widest uppercase mb-3 text-sm md:text-base">
              SMARTRAIL - TRAIN BOOKING SYSTEM
            </h2>
            
            {/* Main Hero Text */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-10 leading-tight drop-shadow-md">
              Made your booking experience easy!
            </h1>

            {/* Floating Search Widget */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">From</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Delhi" 
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">To</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai" 
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-600 rounded-lg p-3">
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Date</label>
                  <input 
                    type="date" 
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg mt-2 transition-all shadow-lg shadow-blue-600/30"
                >
                  {loading ? 'Searching...' : 'Search for trains'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-10 text-gray-500">
            <p>Searching for trains...</p>
          </div>
        )}

        {!loading && searched && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {trains.length > 0
                  ? `${trains.length} train${trains.length > 1 ? 's' : ''} found`
                  : 'No trains found'}
              </h2>
              <p className="text-sm text-gray-500">
                {searchFrom} to {searchTo} on {searchDate}
              </p>
            </div>

            {trains.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                No trains available on this route/date.
              </div>
            ) : (
              <div className="space-y-3">
                {trains.map((train) => (
                  <TrainCard key={train._id} train={train} journeyDate={searchDate} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
