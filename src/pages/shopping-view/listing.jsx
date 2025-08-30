"use client";
import {
  memo,
  useCallback,
  useMemo,
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions, categoryOptionsMap } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpDownIcon,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Lazy load components
const ProductFilter = lazy(() => import("@/components/shopping-view/filter"));
const ShoppingProductTile = lazy(() =>
  import("@/components/shopping-view/product-tile")
);

// Optimize UI components with lazy loading
const Button = lazy(() =>
  import("@/components/ui/button").then((module) => ({
    default: module.Button,
  }))
);
const Badge = lazy(() =>
  import("@/components/ui/badge").then((module) => ({
    default: module.Badge,
  }))
);
const DropdownMenu = lazy(() =>
  import("@/components/ui/dropdown-menu").then((module) => ({
    default: module.DropdownMenu,
  }))
);
const DropdownMenuContent = lazy(() =>
  import("@/components/ui/dropdown-menu").then((module) => ({
    default: module.DropdownMenuContent,
  }))
);
const DropdownMenuRadioGroup = lazy(() =>
  import("@/components/ui/dropdown-menu").then((module) => ({
    default: module.DropdownMenuRadioGroup,
  }))
);
const DropdownMenuRadioItem = lazy(() =>
  import("@/components/ui/dropdown-menu").then((module) => ({
    default: module.DropdownMenuRadioItem,
  }))
);
const DropdownMenuTrigger = lazy(() =>
  import("@/components/ui/dropdown-menu").then((module) => ({
    default: module.DropdownMenuTrigger,
  }))
);

const ProductSkeleton = memo(() => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
    <div className="p-4 space-y-3">
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 rounded w-3/4 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite_0.2s]"></div>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 rounded w-1/2 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite_0.4s]"></div>
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 rounded w-20 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite_0.6s]"></div>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-8 rounded w-24 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite_0.8s]"></div>
      </div>
    </div>
  </div>
));

ProductSkeleton.displayName = "ProductSkeleton";

// Mobile-optimized no products component
const NoProducts = memo(() => (
  <div className="col-span-full text-center py-16 px-4">
    <div className="text-6xl sm:text-8xl mb-6">🔍</div>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
      No products found
    </h3>
    <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
      Try adjusting your filters or search terms to find what you're looking for
    </p>
  </div>
));

NoProducts.displayName = "NoProducts";

// 🔥 UPDATED: Fixed Pagination Component - Removed items per page selector
const PaginationControls = memo(
  ({ currentPage, totalPages, totalItems, onPageChange, isLoading }) => {
    const ITEMS_PER_PAGE = 20; // Fixed to 20 items per page

    // Generate page numbers to show
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white rounded-lg shadow-sm border">
        {/* Results Info */}
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing{" "}
          <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
          <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
          products
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          {/* First Page & Previous */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || isLoading}
              className="hidden sm:flex w-8 h-8 p-0"
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="w-8 h-8 p-0"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, index) =>
              pageNum === "..." ? (
                <div key={`dots-${index}`} className="px-2">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              ) : (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  className={`w-8 h-8 p-0 ${
                    currentPage === pageNum
                      ? "bg-[#6C3D1D] hover:bg-[#5A321A] text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          {/* Next & Last Page */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="w-8 h-8 p-0"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="hidden sm:flex w-8 h-8 p-0"
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

PaginationControls.displayName = "PaginationControls";

// 🔥 UPDATED: Search params helper with fixed items per page
const createSearchParamsHelper = (filterParams, page) => {
  const queryParams = [];

  // Add filters
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const encodedValues = value.map((v) => encodeURIComponent(v)).join(",");
      queryParams.push(`${key}=${encodedValues}`);
    }
  }

  // Add pagination params
  if (page > 1) queryParams.push(`page=${page}`);

  return queryParams.join("&");
};

// 🔥 UPDATED: Main component with fixed pagination logic
function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, isLoading, pagination } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // 🔥 FIXED: Constants for pagination
  const ITEMS_PER_PAGE = 20; // Fixed to 20 items per page

  const categorySearchParam = searchParams.get("category");
  const pageParam = Number.parseInt(searchParams.get("page")) || 1;

  // Initialize pagination state from URL
  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  // Memoize expensive calculations
  const productCount = useMemo(
    () => pagination?.totalProducts || productList?.length || 0,
    [pagination, productList]
  );

  const totalPages = useMemo(
    () => pagination?.totalPages || Math.ceil(productCount / ITEMS_PER_PAGE),
    [pagination, productCount]
  );

  // Optimized handlers with useCallback
  const handleSort = useCallback((value) => {
    setSort(value);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
        setIsPageTransitioning(true);
        setLoadedProducts(new Set()); // Clear loaded products for new page
        setCurrentPage(newPage);

        // Multiple scroll methods for better browser compatibility
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          if (window.pageYOffset > 0) {
            window.scrollTo(0, 0);
          }
        }, 100);
        setTimeout(() => {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0; // For Safari
        }, 200);
      }
    },
    [currentPage, totalPages]
  );

  const handleFilter = useCallback(
    (getSectionId, getCurrentOption) => {
      let cpyFilters = { ...filters };

      if (getSectionId === "price") {
        const isCurrentlySelected =
          cpyFilters[getSectionId] &&
          cpyFilters[getSectionId].includes(getCurrentOption);

        if (isCurrentlySelected) {
          delete cpyFilters[getSectionId];
        } else {
          cpyFilters = {
            ...cpyFilters,
            [getSectionId]: [getCurrentOption],
          };
        }
      } else {
        const currentOptions = cpyFilters[getSectionId] || [];
        const indexOfCurrentOption = currentOptions.indexOf(getCurrentOption);

        if (indexOfCurrentOption === -1) {
          cpyFilters[getSectionId] = [...currentOptions, getCurrentOption];
        } else {
          cpyFilters[getSectionId] = currentOptions.filter(
            (option) => option !== getCurrentOption
          );
        }

        if (cpyFilters[getSectionId].length === 0) {
          delete cpyFilters[getSectionId];
        }
      }

      setIsPageTransitioning(true);
      setLoadedProducts(new Set());
      setFilters(cpyFilters);
      setCurrentPage(1); // Reset to first page when filtering

      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, 0);
        }
      }, 100);

      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    },
    [filters]
  );

  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
      const getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          (item) => item.productId === getCurrentProductId
        );
        if (indexOfCurrentItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });
            return;
          }
        }
      }

      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product is added to cart",
          });
        }
      });
    },
    [cartItems.items, dispatch, toast, user?.id]
  );

  // Filter initialization with URL parsing
  useEffect(() => {
    try {
      const savedFilters = JSON.parse(
        sessionStorage.getItem("filters") || "{}"
      );

      if (categorySearchParam) {
        const categoryArray = categorySearchParam
          .split(",")
          .map((cat) => decodeURIComponent(cat.trim()))
          .filter((cat) => cat);

        const mergedFilters = { ...savedFilters };
        mergedFilters.category = categoryArray;

        setFilters(mergedFilters);
        sessionStorage.setItem("filters", JSON.stringify(mergedFilters));
      } else {
        setFilters(savedFilters);
      }
    } catch (error) {
      console.error("❌ Error parsing filters:", error);
      setFilters({});
    }
  }, [categorySearchParam]);

  // 🔥 UPDATED: URL update with fixed pagination
  useEffect(() => {
    const timeout = setTimeout(() => {
      const createQueryString = createSearchParamsHelper(filters, currentPage);
      setSearchParams(new URLSearchParams(createQueryString));
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, currentPage, setSearchParams]);

  // 🔥 UPDATED: API call with fixed items per page
  useEffect(() => {
    if (filters !== null && sort !== null) {
      const timeout = setTimeout(() => {
        dispatch(
          fetchAllFilteredProducts({
            filterParams: filters,
            sortParams: sort,
            page: currentPage,
            limit: ITEMS_PER_PAGE, // Fixed to 20
          })
        );
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, sort, filters, currentPage]);

  useEffect(() => {
    if (!isLoading && productList && productList.length > 0) {
      const timer = setTimeout(() => {
        setIsPageTransitioning(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, productList]);

  const productGrid = useMemo(() => {
    const shouldShowSkeletons = isLoading || isPageTransitioning;

    if (shouldShowSkeletons) {
      return Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
        <ProductSkeleton key={`skeleton-${currentPage}-${index}`} />
      ));
    }

    if (!productList || productList.length === 0) {
      return <NoProducts />;
    }

    return productList.map((productItem, index) => (
      <Suspense
        key={`${productItem._id || productItem.id}-${currentPage}`}
        fallback={<ProductSkeleton />}
      >
        <ShoppingProductTile
          product={productItem}
          handleAddtoCart={handleAddtoCart}
          onLoad={() => {
            setLoadedProducts(
              (prev) => new Set([...prev, productItem._id || productItem.id])
            );
          }}
        />
      </Suspense>
    ));
  }, [
    productList,
    isLoading,
    isPageTransitioning,
    handleAddtoCart,
    currentPage,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-5">
      {/* Mobile-First Layout Container */}
      <div className="w-full max-w-none px-4 sm:px-6 md:px-8">
        {/* Mobile Filter Section */}
        <div className="md:hidden mb-6">
          <Suspense
            fallback={
              <div className="bg-gray-100 h-12 rounded-lg animate-pulse"></div>
            }
          >
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </Suspense>
        </div>

        {/* Main Content Grid */}
        <div className="md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block">
            <Suspense
              fallback={
                <div className="bg-gray-100 h-96 rounded-lg animate-pulse"></div>
              }
            >
              <ProductFilter filters={filters} handleFilter={handleFilter} />
            </Suspense>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Enhanced Header */}
            <div className="p-4 sm:p-6 border-b">
              <div className="flex flex-col gap-4">
                {/* Top Row: Title and Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Title and Count */}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      All Products
                    </h1>
                    <p className="text-sm text-gray-600">
                      {productCount}{" "}
                      {productCount === 1 ? "Product" : "Products"} Found
                      {totalPages > 1 && (
                        <span className="ml-2">
                          • Page {currentPage} of {totalPages}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-3">
                    <Suspense
                      fallback={
                        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                      }
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 min-w-[90px] md:min-w-[100px] justify-start bg-transparent"
                          >
                            <ArrowUpDownIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Sort by</span>
                            <span className="sm:hidden">Sort</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuRadioGroup
                            value={sort}
                            onValueChange={handleSort}
                          >
                            {sortOptions.map((sortItem) => (
                              <DropdownMenuRadioItem
                                value={sortItem.id}
                                key={sortItem.id}
                                className="cursor-pointer"
                              >
                                {sortItem.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Suspense>
                  </div>
                </div>

                {/* Active Filters */}
                <div className="flex-1">
                  {Object.keys(filters).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, values]) =>
                        Array.isArray(values)
                          ? values.map((value) => (
                              <Suspense
                                key={`${key}-${value}`}
                                fallback={
                                  <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                                }
                              >
                                <Badge
                                  variant="secondary"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
                                >
                                  <span className="font-medium">
                                    {key === "category"
                                      ? categoryOptionsMap[value] || value
                                      : value}
                                  </span>
                                  <button
                                    onClick={() => handleFilter(key, value)}
                                    className="hover:bg-blue-300 rounded-full p-1 transition-colors duration-200 ml-1"
                                    aria-label={`Remove ${value} filter`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              </Suspense>
                            ))
                          : null
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 🔥 UPDATED: Fixed Product Grid - 5x4 layout (20 products) */}
            <div className="p-4 sm:p-6">
              {productList && productList.length > 0 ? (
                <>
                  {/* Fixed 5-column grid for exactly 20 products (5x4) */}
                  <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
                    {productGrid}
                  </div>

                  {/* 🔥 UPDATED: Pagination Controls without items per page selector */}
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={productCount}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                </>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
                  {productGrid}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {(isLoading || isPageTransitioning) && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6C3D1D]"></div>
            <span className="text-gray-700 font-medium">
              {isPageTransitioning ? "Loading page..." : "Loading products..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ShoppingListing);
