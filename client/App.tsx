import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';

import LandingPage from './src/pages/LandingPage';
import HomePage from './src/pages/HomePage';
import SearchPage from './src/pages/SearchPage';
import MatchesPage from './src/pages/MatchesPage';
import ChatPage from './src/pages/ChatPage';
import ProfilePage from './src/pages/ProfilePage';
import SettingsPage from './src/pages/SettingsPage';
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import VerifyOtpPage from './src/pages/VerifyOtpPage';
import SEO from './src/components/SEO';
import MainLayout from './src/components/MainLayout';

import ProtectedRoute from './src/components/ProtectedRoute';
import { fetchCurrentUser, refreshAccessToken } from './src/store/slices/authSlice';
import { AppDispatch } from './src/store';
import { SocketProvider } from './src/sockets/socketProvider';

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
      } else {
        console.error('Failed to refresh access token during app initialization');
        navigate('/login');
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

      <SocketProvider>
        <Routes>
        {/* Public */}
        <Route path="/" element={<><SEO title="Home" /><LandingPage navigate={navigate} /></>} />
        <Route path="/login" element={<><SEO title="Login" /><LoginPage navigate={navigate} /></>} />
        <Route path="/register" element={<><SEO title="Join the Community" /><RegisterPage navigate={navigate} /></>} />
        <Route path="/verify-otp" element={<><SEO title="Verify Email" /><VerifyOtpPage navigate={navigate} /></>} />

        {/* Protected */}
        <Route element={<ProtectedRoute navigate={navigate}/>}>
          {/* Main Layout with Navbar and Footer */}
          <Route element={<MainLayout navigate={navigate}/>}>
            <Route path="/home" element={<><SEO title="Dashboard" /><HomePage navigate={navigate} /></>} />
            <Route path="/profile/:id?" element={<><SEO title="Member Profile" /><ProfilePage navigate={navigate} /></>} />
            <Route path="/settings" element={<><SEO title="Account Settings" /><SettingsPage navigate={navigate} /></>} />
            <Route path="/matches" element={<><SEO title="My Swaps" /><MatchesPage navigate={navigate} /></>} />
            <Route path="/search" element={<><SEO title="Find Partners" /><SearchPage navigate={navigate} /></>} />
          </Route>
          {/* No Header Layout */}
          <Route path="/chat" element={<><SEO title="Workspace" /><ChatPage navigate={navigate} /></>} />
        </Route>
      </Routes>
      </SocketProvider>
    </>
  );
};

export default App;
