import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProtectedRoute: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // 🚫 Not authenticated → redirect to login
  if (!token) {
    navigate('/');
  }

  // ✅ Authenticated → allow route
  return (
    <Outlet />
  );
};

export default ProtectedRoute;
