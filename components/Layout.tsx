import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { LayoutDashboard, Search, CalendarDays, LogOut, Settings, Disc, CalendarClock } from 'lucide-react';

export const Layout: React.FC = () => {
  const { currentUser, logout } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-night-950 text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Sidebar / Mobile Header */}
      <aside className="w-full md:w-64 bg-night-900 border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-purple to-neon-blue animate-pulse-glow flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="font-bold text-xl tracking-tight text-white">NightShift</span>
        </div>

        <nav className="px-4 pb-4 md:py-4 space-y-1 overflow-x-auto md:overflow-visible flex md:block gap-2 md:gap-0">
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/dashboard') ? 'bg-night-800 text-neon-purple shadow-lg shadow-purple-900/10' : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>

          {currentUser?.role === 'PLANNER' && (
            <Link to="/browse" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/browse') ? 'bg-night-800 text-neon-blue shadow-lg shadow-blue-900/10' : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'}`}>
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Browse DJs</span>
            </Link>
          )}

          {currentUser?.role === 'DJ' && (
             <Link to="/availability" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/availability') ? 'bg-night-800 text-neon-cyan shadow-lg shadow-cyan-900/10' : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'}`}>
                <CalendarClock className="w-5 h-5" />
                <span className="hidden md:inline">Availability</span>
             </Link>
          )}

          <Link to="/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/bookings') ? 'bg-night-800 text-neon-pink shadow-lg shadow-pink-900/10' : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'}`}>
            <CalendarDays className="w-5 h-5" />
            <span className="hidden md:inline">Bookings</span>
          </Link>
          
          <div className="md:mt-8 border-t border-slate-800 pt-4 hidden md:block px-4">
             <p className="text-xs font-bold text-slate-500 uppercase mb-2">Account</p>
             <div className="flex items-center gap-3 px-2 py-2 mb-4">
                <img src={currentUser?.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-slate-600" />
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.role}</p>
                </div>
             </div>
             <button onClick={handleLogout} className="flex items-center gap-3 px-2 py-2 w-full text-left text-slate-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* Subtle Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none -z-10" />
        <Outlet />
      </main>
    </div>
  );
};