// src/App.jsx - WITH DEBUG COMPONENT (TEMPORARY)
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, initializeAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { openLoginModal } from "./store/auth-slice/modal-slice.js";
import LoginRequiredModal from "./components/common/login-required-modal";

// ✅ TEMPORARY: Import debug component
import TokenDebug from "./components/debug/TokenDebug";

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
  const { user, isAuthenticated, isLoading, token } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();

  // ✅ Initialize auth state on app start
  useEffect(() => {
    console.log("🚀 App starting, initializing auth...");
    dispatch(initializeAuth());
  }, [dispatch]);

  // ✅ Check auth when we have token but no user
  useEffect(() => {
    if (token && !user && !isLoading) {
      console.log("🔍 Token found but no user, checking auth...");
      dispatch(checkAuth());
    }
  }, [dispatch, token, user, isLoading]);

  // ✅ Handle login modal for protected routes
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const publicPaths = ["/", "/auth/login", "/auth/register"];
    const isPublicRoute =
      publicPaths.includes(location.pathname) ||
      location.pathname.startsWith("/auth");

    if (!isAuthenticated && !isPublicRoute && !token) {
      dispatch(openLoginModal());
    }
  }, [isLoading, isAuthenticated, location.pathname, dispatch, token]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* ✅ TEMPORARY: Debug component to see token status */}
      <TokenDebug />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<ShoppingLayout />}>
            <Route index element={<ShoppingHome />} />
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
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
