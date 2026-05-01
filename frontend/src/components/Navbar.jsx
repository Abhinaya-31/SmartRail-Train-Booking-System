import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`${
        isHome
          ? 'bg-white text-gray-800 shadow-sm border-b border-gray-100'
          : 'bg-[#0f172a]/95 text-slate-100 shadow-lg border-b border-emerald-400/20 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`flex items-center gap-2 text-xl tracking-tight group ${isHome ? 'text-gray-900' : 'text-white'}`}>
          <svg className="w-8 h-8 text-[#10B981] group-hover:text-[#34D399] transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2.23v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 2c3.71 0 5.13.46 5.67 1H6.33c.54-.54 1.96-1 5.67-1zM6 6h12v4.5H6V6zm6 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          </svg>
          <span className="font-extrabold tracking-tight">SmartRail</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/pnr-status" label="PNR Status" active={isActive('/pnr-status')} />
          {user && (
            <>
              <NavLink to="/search" label="Search Trains" active={isActive('/search')} />
              <NavLink to="/bookings" label="My Bookings" active={isActive('/bookings')} />
              {user.role === 'admin' && (
                <NavLink to="/admin" label="Admin Dashboard" active={isActive('/admin')} />
              )}
            </>
          )}
        </nav>

        {/* User section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hidden sm:flex ${isHome ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isHome ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-emerald-900/40 text-emerald-300 border-emerald-400/30'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={`text-sm font-semibold ${isHome ? 'text-gray-700' : 'text-slate-100'}`}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                  isHome
                    ? 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600'
                    : 'bg-white/10 border border-white/20 text-slate-100 hover:bg-red-500/20 hover:text-red-300'
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${isHome ? 'text-gray-600 hover:bg-gray-100' : 'text-slate-200 hover:bg-white/10'}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#10B981] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#059669] transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className={`md:hidden px-4 py-2 flex gap-4 text-sm overflow-x-auto whitespace-nowrap ${isHome ? 'border-t border-gray-100 bg-white' : 'border-t border-white/10 bg-[#0f172a]/95'}`}>
        <Link to="/pnr-status" className={`pb-1 ${isActive('/pnr-status') ? `border-b-2 border-[#10B981] font-bold ${isHome ? 'text-gray-900' : 'text-white'}` : `${isHome ? 'text-gray-500' : 'text-slate-300'}`}`}>
          PNR Status
        </Link>
        {user && (
          <>
            <Link to="/search" className={`pb-1 ${isActive('/search') ? `border-b-2 border-[#10B981] font-bold ${isHome ? 'text-gray-900' : 'text-white'}` : `${isHome ? 'text-gray-500' : 'text-slate-300'}`}`}>
              Search
            </Link>
            <Link to="/bookings" className={`pb-1 ${isActive('/bookings') ? `border-b-2 border-[#10B981] font-bold ${isHome ? 'text-gray-900' : 'text-white'}` : `${isHome ? 'text-gray-500' : 'text-slate-300'}`}`}>
              Bookings
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className={`pb-1 ${isActive('/admin') ? `border-b-2 border-[#10B981] font-bold ${isHome ? 'text-gray-900' : 'text-white'}` : `${isHome ? 'text-gray-500' : 'text-slate-300'}`}`}>
                Admin
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, label, active }) => {
  const isHome = useLocation().pathname === '/';
  return (
  <Link
    to={to}
    className={`px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
      active
        ? isHome
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
        : isHome
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-slate-200 hover:bg-white/10 hover:text-white'
    }`}
  >
    {label}
  </Link>
);
};

export default Navbar;
