import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { openLoginModal } from "../../store/auth-slice/modal-slice.js";

const CheckAuth = ({
  children,
  isAuthenticated,
  user,
  requiredRole = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated, show login modal and redirect
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      // Small delay to show modal before redirect
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1000);
      return;
    }

    // If authenticated but wrong role
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
  }, [isAuthenticated, user, requiredRole, dispatch, navigate]);

  // Don't render children if not authenticated
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
