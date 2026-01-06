import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import SEO from './components/SEO';

import ProtectedRoute from './components/ProtectedRoute';
import { fetchCurrentUser, refreshAccessToken } from './src/store/slices/authSlice';
import { AppDispatch } from './src/store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial auth refresh
  useEffect(() => {
    const initAuth = async () => {
      const res = await dispatch(refreshAccessToken());
      if (refreshAccessToken.fulfilled.match(res)) {
        await dispatch(fetchCurrentUser());
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" closeButton />

      <Routes>
        {/* Public */}
        <Route path="/" element={<><SEO title="Home" /><LandingPage navigate={navigate} /></>} />
        <Route path="/login" element={<><SEO title="Login" /><LoginPage navigate={navigate} /></>} />
        <Route path="/register" element={<><SEO title="Join the Community" /><RegisterPage navigate={navigate} /></>} />
        <Route path="/verify-otp" element={<><SEO title="Verify Email" /><VerifyOtpPage navigate={navigate} /></>} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<><SEO title="Dashboard" /><HomePage navigate={navigate} /></>} />
          <Route path="/search" element={<><SEO title="Find Partners" /><SearchPage navigate={navigate} /></>} />
          <Route path="/matches" element={<><SEO title="My Swaps" /><MatchesPage navigate={navigate} /></>} />
          <Route path="/chat" element={<><SEO title="Workspace" /><ChatPage navigate={navigate} /></>} />
          <Route path="/profile/:id?" element={<><SEO title="Member Profile" /><ProfilePage navigate={navigate} /></>} />
          <Route path="/settings" element={<><SEO title="Account Settings" /><SettingsPage navigate={navigate} /></>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
