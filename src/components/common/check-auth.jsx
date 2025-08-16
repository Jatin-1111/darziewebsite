import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { openLoginModal } from "../../store/auth-slice/modal-slice.js";

const CheckAuth = ({
  children,
  isAuthenticated,
  user,
  requiredRole = null,
  allowGuests = false, // 🔥 NEW PROP
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🚀 NEW: Allow guests to browse if allowGuests is true
    if (allowGuests && !isAuthenticated) {
      // Guest can access this route
      return;
    }

    // If not authenticated and guests not allowed, show login modal
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1000);
      return;
    }

    // Role-based access control (existing logic)
    if (isAuthenticated && user && requiredRole) {
      if (requiredRole === "admin" && user.role !== "admin") {
        navigate("/shop/home", { replace: true });
        return;
      }

      if (requiredRole === "user" && user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, requiredRole, allowGuests, dispatch, navigate]);

  // 🔥 NEW: Don't render loading for guests on allowed routes
  if (!isAuthenticated && allowGuests) {
    return <>{children}</>;
  }

  // Don't render children if not authenticated (existing logic)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CheckAuth;
