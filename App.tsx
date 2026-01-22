import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { User, DJProfile, Venue, Booking } from './types';
import { MOCK_USERS, MOCK_DJ_PROFILES, MOCK_VENUES } from './constants';
import { Layout } from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import PlannerDashboard from './pages/PlannerDashboard';
import DJDashboard from './pages/DJDashboard';
import BrowseDJs from './pages/BrowseDJs';
import AdminDashboard from './pages/AdminDashboard';
import BookingsPage from './pages/BookingsPage';
import DJAvailability from './pages/DJAvailability';
import EditProfile from './pages/EditProfile';

// Global State Context (Simplified for this prototype)
export const AppContext = React.createContext<{
  currentUser: User | null;
  login: (role: string) => void;
  logout: () => void;
}>({
  currentUser: null,
  login: () => {},
  logout: () => {}
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (role: string) => {
    let user;
    if (role === 'PLANNER') user = MOCK_USERS[0]; // Alice
    if (role === 'DJ') user = MOCK_USERS[2]; // David
    if (role === 'ADMIN') user = MOCK_USERS[7]; // Admin
    setCurrentUser(user || null);
  };

  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{ currentUser, login, logout }}>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              !currentUser ? <Navigate to="/" /> :
              currentUser.role === 'PLANNER' ? <PlannerDashboard /> :
              currentUser.role === 'DJ' ? <DJDashboard /> :
              <AdminDashboard />
            } />
            <Route path="/browse" element={currentUser?.role === 'PLANNER' ? <BrowseDJs /> : <Navigate to="/dashboard" />} />
            <Route path="/bookings" element={currentUser ? <BookingsPage /> : <Navigate to="/" />} />
            <Route path="/availability" element={currentUser?.role === 'DJ' ? <DJAvailability /> : <Navigate to="/dashboard" />} />
            <Route path="/profile/edit" element={currentUser?.role === 'DJ' ? <EditProfile /> : <Navigate to="/dashboard" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}