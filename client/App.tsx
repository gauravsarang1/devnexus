import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchCurrentUser, refreshAccessToken } from './src/store/slices/authSlice';
import { AppDispatch, RootState } from './src/store';

const App: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial Auth Refresh & Load
  useEffect(() => {
    const initAuth = async () => {
      // Try to get a fresh access token from the refresh cookie first
      const refreshResult = await dispatch(refreshAccessToken());
      
      if (refreshAccessToken.fulfilled.match(refreshResult)) {
        await dispatch(fetchCurrentUser());
      }
      
      setIsInitializing(false);
    };

    initAuth();

    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  // REFRESH TOKEN ON EVERY PAGE CHANGE / REFRESH
  // This ensures that navigating to a new route always attempts to validate the session
  useEffect(() => {
    const syncSession = async () => {
      if (!isInitializing) {
        const refreshResult = await dispatch(refreshAccessToken());
        if (refreshAccessToken.fulfilled.match(refreshResult)) {
          // If we weren't logged in but the refresh worked, get user data
          if (!user) {
            dispatch(fetchCurrentUser());
          }
        }
      }
    };
    
    syncSession();
  }, [path, dispatch]);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    const protectedPaths = ['/home', '/matches', '/chat', '/profile', '/settings'];
    const isProtected = protectedPaths.some(p => path.startsWith(p));
    
    // Auth Protection Logic using in-memory token
    if (isProtected && !token) {
      return <><SEO title="Login" /><LoginPage navigate={navigate} /></>;
    }

    // Auth Pages should redirect if logged in
    if ((path === '/login' || path === '/register') && token) {
      navigate('/home');
      return <HomePage navigate={navigate} />;
    }

    if (path === '/home') return (
      <>
        <SEO title="Dashboard" description="Manage your skill swaps and track your progress." />
        <HomePage navigate={navigate} />
      </>
    );
    
    if (path === '/search') return (
      <>
        <SEO title="Find Partners" description="Search for skilled developers, designers, and creators to swap knowledge with." />
        <SearchPage navigate={navigate} />
      </>
    );

    if (path === '/matches') return (
      <>
        <SEO title="My Swaps" description="View and manage your active collaboration requests." />
        <MatchesPage navigate={navigate} />
      </>
    );

    if (path === '/chat') return (
      <>
        <SEO title="Workspace" description="Coordinate your collaboration in real-time." />
        <ChatPage navigate={navigate} />
      </>
    );

    if (path.startsWith('/profile')) return (
      <>
        <SEO title="Member Profile" description="Explore the expertise and learning goals of the SkillSwap community." />
        <ProfilePage navigate={navigate} />
      </>
    );

    if (path === '/settings') return (
      <>
        <SEO title="Account Settings" />
        <SettingsPage navigate={navigate} />
      </>
    );

    if (path === '/login') return <><SEO title="Login" /><LoginPage navigate={navigate} /></>;
    if (path === '/register') return <><SEO title="Join the Community" description="Create your profile and start swapping skills today." /><RegisterPage navigate={navigate} /></>;
    if (path.startsWith('/verify-otp')) return <><SEO title="Verify Email" /><VerifyOtpPage navigate={navigate} /></>;
    
    return <><SEO title="Home" /><LandingPage navigate={navigate} /></>;
  };

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      {renderContent()}
    </>
  );
};

export default App;