// src/pages/shopping-view/home.jsx - UPDATED WITH NEW COMPONENTS
import { Suspense, lazy, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { getFeatureImages } from "@/store/common-slice";

// Lazy load section components - UPDATED IMPORTS
const HeroBannerSection = lazy(() =>
  import("../../components/shopping-view/home/HeroBannerSection")
);
const BestSellersSection = lazy(() =>
  import("../../components/shopping-view/home/BestSellersSection")
);
const CollectionsSection = lazy(() =>
  import("../../components/shopping-view/home/CollectionsSection")
);
const TestimonialsSection = lazy(() =>
  import("../../components/shopping-view/home/TestimonialsSection")
);

// Loading skeleton components
const SectionSkeleton = ({ height = "h-screen" }) => (
  <div
    className={`${height} w-full bg-gray-100 animate-pulse flex items-center justify-center`}
  >
    <div className="text-gray-400">Loading...</div>
  </div>
);

function ShoppingHome() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // Memoize best sellers to prevent unnecessary re-calculations
  const bestSellers = useMemo(() => {
    return productList && productList.length > 0 ? productList.slice(0, 4) : [];
  }, [productList]);

  // Initial data fetching
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Banner */}
      <Suspense fallback={<SectionSkeleton />}>
        <HeroBannerSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CollectionsSection />
      </Suspense>
      
      {/* Best Sellers Section */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <BestSellersSection bestSellers={bestSellers} />
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <TestimonialsSection />
      </Suspense>
    </div>
  );
}

export default ShoppingHome;
