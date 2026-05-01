import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('trains');
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [trainForm, setTrainForm] = useState({
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: '',
    fare: '',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'trains') fetchTrains();
    if (activeTab === 'bookings') fetchAllBookings();
  }, [activeTab]);

  const fetchTrains = async () => {
    setLoadingTrains(true);
    try {
      const { data } = await api.get('/trains');
      setTrains(data);
    } catch {
      toast.error('Failed to load trains');
    } finally {
      setLoadingTrains(false);
    }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleFormChange = (e) => {
    setTrainForm({ ...trainForm, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    const current = trainForm.runningDays;
    setTrainForm({
      ...trainForm,
      runningDays: current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day],
    });
  };

  const handleAddTrain = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post('/admin/trains', {
        ...trainForm,
        totalSeats: parseInt(trainForm.totalSeats),
        fare: parseInt(trainForm.fare),
      });
      toast.success(`Train "${data.trainName}" added successfully`);
      setTrains((prev) => [data, ...prev]);
      // Reset form
      setTrainForm({
        trainNumber: '', trainName: '', source: '', destination: '',
        departureTime: '', arrivalTime: '', totalSeats: '', fare: '',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add train');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrain = async (trainId, trainName) => {
    if (!window.confirm(`Delete "${trainName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/trains/${trainId}`);
      setTrains((prev) => prev.filter((t) => t._id !== trainId));
      toast.success('Train deleted');
    } catch {
      toast.error('Failed to delete train');
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="page-title bg-gradient-to-r from-slate-800 via-slate-700 to-emerald-700 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <span className="text-xs bg-red-100/70 text-red-700 px-2 py-0.5 rounded font-medium border border-red-200">ADMIN</span>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex flex-col justify-center items-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Trains</p>
          <p className="text-3xl font-black text-indigo-600">{trains.length}</p>
        </div>
        <div className="card p-5 flex flex-col justify-center items-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Bookings</p>
          <p className="text-3xl font-black text-blue-600">{bookings.length}</p>
        </div>
        <div className="card p-5 flex flex-col justify-center items-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-emerald-600">
            ₹{bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalFare, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {['trains', 'bookings', 'add-train'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'add-train' ? 'Add Train' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Manage Trains Tab */}
      {activeTab === 'trains' && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">All Trains ({trains.length})</h2>
          {loadingTrains ? (
            <p className="text-gray-400 text-center py-8">Loading trains...</p>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Train</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Route</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Timing</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-medium">Seats</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-medium">Fare</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trains.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{t.trainName}</p>
                        <p className="text-gray-400 font-mono text-xs">#{t.trainNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {t.source} → {t.destination}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {t.departureTime} – {t.arrivalTime}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={t.availableSeats < 20 ? 'text-orange-600 font-medium' : 'text-gray-700'}>
                          {t.availableSeats}
                        </span>
                        <span className="text-gray-400">/{t.totalSeats}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">₹{t.fare}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteTrain(t._id, t.trainName)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {trains.length === 0 && (
                <p className="text-center text-gray-400 py-8">No trains in database</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">All Bookings ({bookings.length})</h2>
          {loadingBookings ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">PNR</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">User</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Train</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-medium">Seats</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-medium">Fare</th>
                    <th className="text-center px-4 py-3 text-gray-600 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-blue-700 text-xs">{b.pnr}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{b.user?.name}</p>
                        <p className="text-gray-400 text-xs">{b.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {b.train?.trainName}
                        <br />
                        <span className="text-xs text-gray-400">
                          {b.train?.source} → {b.train?.destination}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.journeyDate}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{b.seatsBooked}</td>
                      <td className="px-4 py-3 text-right text-gray-700">₹{b.totalFare.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          b.status === 'confirmed'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <p className="text-center text-gray-400 py-8">No bookings found</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Train Tab */}
      {activeTab === 'add-train' && (
        <div className="max-w-2xl">
          <h2 className="font-semibold text-gray-700 mb-4">Add New Train</h2>
          <div className="card p-5">
            <form onSubmit={handleAddTrain} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Train Number</label>
                  <input name="trainNumber" value={trainForm.trainNumber} onChange={handleFormChange}
                    className="form-input" placeholder="e.g. 12301" required />
                </div>
                <div>
                  <label className="form-label">Train Name</label>
                  <input name="trainName" value={trainForm.trainName} onChange={handleFormChange}
                    className="form-input" placeholder="e.g. Rajdhani Express" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Source</label>
                  <input name="source" value={trainForm.source} onChange={handleFormChange}
                    className="form-input" placeholder="e.g. Delhi" required />
                </div>
                <div>
                  <label className="form-label">Destination</label>
                  <input name="destination" value={trainForm.destination} onChange={handleFormChange}
                    className="form-input" placeholder="e.g. Mumbai" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Departure Time</label>
                  <input type="time" name="departureTime" value={trainForm.departureTime} onChange={handleFormChange}
                    className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Arrival Time</label>
                  <input type="time" name="arrivalTime" value={trainForm.arrivalTime} onChange={handleFormChange}
                    className="form-input" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Total Seats</label>
                  <input type="number" name="totalSeats" value={trainForm.totalSeats} onChange={handleFormChange}
                    className="form-input" placeholder="e.g. 200" min="1" required />
                </div>
                <div>
                  <label className="form-label">Fare per Seat (₹)</label>
                  <input type="number" name="fare" value={trainForm.fare} onChange={handleFormChange}
                    className="form-input" placeholder="e.g. 1450" min="1" required />
                </div>
              </div>

              {/* Running days */}
              <div>
                <label className="form-label">Running Days</label>
                <div className="flex gap-2 flex-wrap">
                  {days.map((day) => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                        trainForm.runningDays.includes(day)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Adding...' : 'Add Train'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
