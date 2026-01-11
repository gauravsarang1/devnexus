import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProtectedRoute: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // ⏳ Wait until auth is hydrated (VERY important)
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-slate-500 text-sm">Checking session...</span>
      </div>
    );
  }

  // 🚫 Not authenticated → redirect to login
  if (!token) {
    navigate('/login');
  }

  // ✅ Authenticated → allow route
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navigate={navigate}/>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
