// src/components/common/check-auth.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { openLoginModal } from "../../store/auth-slice/modal-slice.js";

const CheckAuth = ({ children, isAuthenticated, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Don't do redirects while still loading
    if (isLoading) {
      console.log("⏳ CheckAuth: Still loading, waiting...");
      return;
    }

    console.log("🔍 CheckAuth:", {
      isAuthenticated,
      userRole: user?.role,
      path: location.pathname,
      loading: isLoading,
    });

    const isPublicOrAuthRoute =
      location.pathname === "/" || location.pathname.startsWith("/auth");

    // Handle unauthenticated users
    if (!isAuthenticated && !isPublicOrAuthRoute) {
      console.log("🚫 CheckAuth: Not authenticated, opening login modal");
      dispatch(openLoginModal());
      return;
    }

    // Handle authenticated users on auth pages
    if (
      isAuthenticated &&
      (location.pathname.includes("/login") ||
        location.pathname.includes("/register"))
    ) {
      console.log(
        "✅ CheckAuth: Authenticated user on auth page, redirecting..."
      );
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/shop/home", { replace: true });
      }
      return;
    }

    // Handle role-based access
    if (isAuthenticated) {
      if (user?.role !== "admin" && location.pathname.includes("admin")) {
        console.log("🚫 CheckAuth: Non-admin trying to access admin");
        navigate("/unauth-page", { replace: true });
        return;
      }

      if (user?.role === "admin" && location.pathname.includes("shop")) {
        console.log(
          "🔄 CheckAuth: Admin accessing shop, redirecting to dashboard"
        );
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }

    console.log("✅ CheckAuth: All checks passed");
  }, [isAuthenticated, dispatch, location.pathname, navigate, user, isLoading]);

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CheckAuth;
