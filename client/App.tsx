import React, { lazy, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './src/components/ErrorBoundry';

const LandingPage = lazy(() => import('./src/pages/LandingPage'));
const HomePage = lazy(() => import('./src/pages/HomePage'));
const SearchPage = lazy(() => import('./src/pages/SearchPage'));
const MatchesPage = lazy(() => import('./src/pages/MatchesPage'));
const ChatPage = lazy(() => import('./src/pages/ChatPage'));
const ProfilePage = lazy(() => import('./src/pages/ProfilePage'));
const SettingsPage = lazy(() => import('./src/pages/SettingsPage'));
const LoginPage = lazy(() => import('./src/pages/LoginPage'));
const RegisterPage = lazy(() => import('./src/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./src/pages/ForgetPasswordPage'));
const VerifyOtpPage = lazy(() => import('./src/pages/VerifyOtpPage'));
const PostFeedPage = lazy(() => import('./src/pages/posts/PostFeedPage'));
const SinglePostPage = lazy(() => import('./src/pages/posts/SinglePostPage'))

import SEO from './src/components/SEO';
import MainLayout from './src/components/MainLayout';

import ProtectedRoute from './src/components/ProtectedRoute';
import { fetchCurrentUser, refreshAccessToken } from './src/store/slices/authSlice';
import { AppDispatch } from './src/store';
import { SocketProvider } from './src/sockets/socketProvider';
import AppLoader from './src/components/AppLoader';

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
        navigate('/');
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <AppLoader />
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error(error, info)}
    >
      <Toaster richColors position="top-center" closeButton />

      <SocketProvider>
        <Routes>
        {/* Public */}
        <Route path="/" element={<><SEO title="Home" /><LandingPage navigate={navigate} /></>} />
        <Route path="/login" element={<><SEO title="Login" /><LoginPage navigate={navigate} /></>} />
        <Route path="/register" element={<><SEO title="Join the Community" /><RegisterPage navigate={navigate} /></>} />
        <Route path="/verify-otp" element={<><SEO title="Verify Email" /><VerifyOtpPage navigate={navigate} /></>} />
        <Route path="/forget-password" element={<><SEO title='Forget Password'/><ForgotPasswordPage navigate={navigate}/></>}/>

        {/* Protected */}
        <Route element={<ProtectedRoute navigate={navigate}/>}>
          {/* Main Layout with Navbar and Footer */}
          <Route element={<MainLayout navigate={navigate}/>}>
            <Route path="/home" element={<><SEO title="Dashboard" /><HomePage navigate={navigate} /></>} />
            <Route path="/profile/:id?" element={<><SEO title="Member Profile" /><ProfilePage navigate={navigate} /></>} />
            <Route path="/settings" element={<><SEO title="Account Settings" /><SettingsPage navigate={navigate} /></>} />
            <Route path="/matches" element={<><SEO title="My Swaps" /><MatchesPage navigate={navigate} /></>} />
            <Route path="/search" element={<><SEO title="Find Partners" /><SearchPage navigate={navigate} /></>} />
            <Route path="/posts" element={<PostFeedPage />} />
            <Route path='/posts/:postId' element={<SinglePostPage />}/>
          </Route>
          {/* No Header Layout */}
          <Route path="/chat" element={<><SEO title="Workspace" /><ChatPage navigate={navigate} /></>} />
        </Route>
      </Routes>
      </SocketProvider>
    </ErrorBoundary>
  );
};

export default App;
