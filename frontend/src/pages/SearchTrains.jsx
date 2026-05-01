import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import TrainCard from '../components/TrainCard';
import toast from 'react-hot-toast';

const SearchTrains = () => {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    source: searchParams.get('from') || '',
    destination: searchParams.get('to') || '',
    date: '',
  });
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // New states for Sorting and Filtering
  const [sortBy, setSortBy] = useState('departure'); // 'departure', 'price_asc', 'price_desc'
  const [hideFullTrains, setHideFullTrains] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, date: today }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!form.source || !form.destination || !form.date) {
      toast.error('Please fill all search fields');
      return;
    }

    setLoading(true);
    setSearched(false);

    try {
      const { data } = await api.get('/trains/search', {
        params: {
          source: form.source.trim(),
          destination: form.destination.trim(),
          date: form.date,
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

  const swapStations = () => {
    setForm({ ...form, source: form.destination, destination: form.source });
  };

  // Helper function to process (filter & sort) the raw trains array before rendering
  const getProcessedTrains = () => {
    let processed = [...trains];

    // Filter by availability
    if (hideFullTrains) {
      processed = processed.filter(t => t.availableSeats > 0);
    }

    // Filter by Train Type
    if (typeFilter !== 'All') {
      processed = processed.filter(t => t.trainType === typeFilter);
    }

    // Sort
    processed.sort((a, b) => {
      if (sortBy === 'price_asc') return a.fare - b.fare;
      if (sortBy === 'price_desc') return b.fare - a.fare;
      // Default: sort by departure time (string comparison works for HH:MM format)
      return a.departureTime.localeCompare(b.departureTime);
    });

    return processed;
  };

  const processedTrains = getProcessedTrains();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="page-title mb-6">Search Trains</h1>

      {/* Search Form */}
      <div className="card p-5 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="form-label">From</label>
              <input
                type="text"
                name="source"
                value={form.source}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Delhi"
                required
              />
            </div>

            {/* Swap button */}
            <div className="flex items-end pb-0.5">
              <button
                type="button"
                onClick={swapStations}
                className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                title="Swap stations"
              >
                ⇄
              </button>
            </div>

            <div className="flex-1">
              <label className="form-label">To</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Mumbai"
                required
              />
            </div>

            <div className="sm:w-40">
              <label className="form-label">Journey Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
                required
              />
            </div>

            <div className="flex items-end">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3 animate-bounce">🚂</div>
          <p>Searching for trains...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="font-semibold text-gray-700">
                {processedTrains.length > 0
                  ? `${processedTrains.length} train${processedTrains.length > 1 ? 's' : ''} found`
                  : 'No trains found'}
              </h2>
              <span className="text-sm text-gray-400">
                {form.source} → {form.destination} | {form.date}
              </span>
            </div>

            {/* Sorting and Filtering Controls */}
            {trains.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                  <input 
                    type="checkbox" 
                    checked={hideFullTrains}
                    onChange={(e) => setHideFullTrains(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Hide full trains
                </label>
                
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-sm bg-white border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="All">All Types</option>
                  <option value="Express">Express</option>
                  <option value="Superfast">Superfast</option>
                  <option value="Rajdhani">Rajdhani</option>
                  <option value="Shatabdi">Shatabdi</option>
                  <option value="Duronto">Duronto</option>
                </select>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-white border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="departure">Sort: Departure Time</option>
                  <option value="price_asc">Sort: Price (Low to High)</option>
                  <option value="price_desc">Sort: Price (High to Low)</option>
                </select>
              </div>
            )}
          </div>

          {processedTrains.length === 0 ? (
            <div className="card p-10 text-center text-gray-500">
              <div className="text-4xl mb-3">😕</div>
              <p className="font-medium">No trains available on this route/date</p>
              <p className="text-sm mt-1 text-gray-400">
                Try a different date or check the station names
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {processedTrains.map((train) => (
                <TrainCard key={train._id} train={train} journeyDate={form.date} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {!loading && !searched && (
        <div className="text-center py-14 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p>Enter source, destination, and date to search for trains</p>
        </div>
      )}
    </div>
  );
};

export default SearchTrains;
