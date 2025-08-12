// src/App.jsx
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { openLoginModal } from "./store/auth-slice/modal-slice.js";
import LoginRequiredModal from "./components/common/login-required-modal";

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

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Skeleton className="w-[800px] bg-black h-[600px]" />
  </div>
);

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const publicPaths = ["/", "/auth/login", "/auth/register"];
    const isPublicRoute =
      publicPaths.includes(location.pathname) ||
      location.pathname.startsWith("/auth");

    if (!isAuthenticated && !isPublicRoute) {
      dispatch(openLoginModal());
    }
  }, [isLoading, isAuthenticated, location.pathname, dispatch, user]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
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
