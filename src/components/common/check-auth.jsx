import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { openLoginModal } from '../../store/auth-slice/modal-slice.js'; 
const CheckAuth = ({ children, isAuthenticated, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isPublicOrAuthRoute = location.pathname === '/' || location.pathname.startsWith('/auth');
    if (!isAuthenticated && !isPublicOrAuthRoute) {
      dispatch(openLoginModal());
    }
    if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop/home");
      }
    }
    if (isAuthenticated) {
      if (user?.role !== "admin" && location.pathname.includes("admin")) {
        navigate("/unauth-page"); 
      }
      if (user?.role === "admin" && location.pathname.includes("shop")) {
        navigate("/admin/dashboard");
      }
    }

  }, [isAuthenticated, dispatch, location.pathname, navigate, user]);
  return <>{children}</>;
};

export default CheckAuth;
