// src/App.jsx - SIMPLIFIED & FIXED VERSION
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, initializeAuth } from "./store/auth-slice";
import { closeLoginModal } from "./store/auth-slice/modal-slice.js";
import LoginRequiredModal from "./components/common/login-required-modal";

// Lazy load components
const AuthLayout = lazy(() => import("./components/auth/layout"));
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));

const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));

const ShoppingLayout = lazy(() => import("./components/shopping-view/layout"));
const ShoppingHome = lazy(() => import("./pages/shopping-view/home"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const AboutUs = lazy(() => import("./pages/shopping-view/aboutus"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));
const PaypalReturnPage = lazy(() =>
  import("./pages/shopping-view/paypal-return")
);
const PaymentSuccessPage = lazy(() =>
  import("./pages/shopping-view/payment-success")
);

const NotFound = lazy(() => import("./pages/not-found"));
const CheckAuth = lazy(() => import("./components/common/check-auth"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();

  // ✅ SIMPLIFIED: Initialize auth once on app start
  useEffect(() => {
    console.log("🚀 App initializing...");
    dispatch(initializeAuth());

    // Only check auth if we have a token
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("🔍 Token found, verifying with server...");
      dispatch(checkAuth());
    }
  }, [dispatch]);

  // ✅ SIMPLIFIED: Handle auth redirects after auth state is determined
  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const isAuthPage = location.pathname.startsWith("/auth");
    const isPublicPage = location.pathname === "/";

    // If on auth page and authenticated, redirect based on role
    if (isAuthPage && isAuthenticated && user) {
      if (user.role === "admin") {
        window.location.replace("/admin/dashboard");
      } else {
        window.location.replace("/shop/home");
      }
      return;
    }

    // If on protected page and not authenticated, close any modals
    if (!isPublicPage && !isAuthPage && !isAuthenticated) {
      dispatch(closeLoginModal());
    }
  }, [isAuthenticated, user, location.pathname, isLoading, dispatch]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Home Route */}
          <Route path="/" element={<ShoppingLayout />}>
            <Route index element={<ShoppingHome />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
                requiredRole="admin"
              >
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          {/* Shop Routes */}
          <Route
            path="/shop"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
                requiredRole="user"
              >
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="about" element={<AboutUs />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <LoginRequiredModal />
    </div>
  );
}

export default App;
