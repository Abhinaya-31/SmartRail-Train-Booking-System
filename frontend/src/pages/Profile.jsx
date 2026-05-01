import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const payload = { name: formData.name };
      if (formData.password) payload.password = formData.password;

      const { data } = await api.put('/auth/profile', payload);
      login(data); // update AuthContext and localStorage
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-[#10B981] to-[#059669] relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-5xl font-bold text-emerald-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Action button */}
          <div className="flex justify-end pt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700'}`}>
              {user.role} Account
            </span>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              {user.email}
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, password: '', confirmPassword: '' });
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {isEditing && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Update Profile Details</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    minLength={6}
                  />
                </div>
                {formData.password && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10B981] text-white font-bold py-2.5 rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/bookings')}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl border border-emerald-200 transition-colors"
            >
              <span>🎫</span>
              <span>View My Bookings</span>
            </button>
            <button
              onClick={() => navigate('/search')}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl border border-emerald-200 transition-colors"
            >
              <span>🔍</span>
              <span>Search New Trains</span>
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign Out Securely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
