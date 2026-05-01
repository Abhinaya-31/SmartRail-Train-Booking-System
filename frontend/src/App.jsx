import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchTrains from './pages/SearchTrains';
import BookTicket from './pages/BookTicket';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import PNRStatus from './pages/PNRStatus';
import Profile from './pages/Profile';

const AppRoutes = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {!isHome && (
        <>
          <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        </>
      )}

      <div className="relative z-10">
        {/* Main Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pnr-status" element={<PNRStatus />} />

            {/* Protected Routes - require user to be logged in */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchTrains />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book/:id"
              element={
                <ProtectedRoute>
                  <BookTicket />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - require admin privileges */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminRequired>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for handling 404s by redirecting to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: '14px',
            background: '#f8fbff',
            color: '#1e293b',
            border: '1px solid #cfd8e3',
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
