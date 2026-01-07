import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ProtectedRoute = () => {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

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
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // 🔥 remember original route
      />
    );
  }

  // ✅ Authenticated → allow route
  return <Outlet />;
};

export default ProtectedRoute;
