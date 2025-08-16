// src/pages/shopping-view/listing.jsx - FIXED VERSION 🔧
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
import { ArrowUpDownIcon, X } from "lucide-react";

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

// Mobile-optimized loading skeleton
const ProductSkeleton = memo(() => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm border">
    <div className="bg-gray-200 h-48 sm:h-56 md:h-64 rounded-t-lg mb-4"></div>
    <div className="p-4 space-y-3">
      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      <div className="bg-gray-200 h-8 rounded w-full"></div>
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

// ✅ FIXED: Enhanced search params helper with proper array handling
const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      // ✅ FIXED: Properly encode each value and join with commas
      const encodedValues = value.map((v) => encodeURIComponent(v)).join(",");
      queryParams.push(`${key}=${encodedValues}`);
    }
  }
  return queryParams.join("&");
};

// Main mobile-responsive component - FIXED VERSION
function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  // Memoize expensive calculations
  const productCount = useMemo(() => productList?.length || 0, [productList]);

  // Optimized handlers with useCallback
  const handleSort = useCallback((value) => {
    setSort(value);
  }, []);

  // ✅ FIX 2: Enhanced filter handler with consistent key usage and price logic
  const handleFilter = useCallback(
    (getSectionId, getCurrentOption) => {
      let cpyFilters = { ...filters };

      // ✅ FIX 3: Handle price filters differently (single selection)
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
        // ✅ FIX 4: Handle category filters (multiple selection)
        const currentOptions = cpyFilters[getSectionId] || [];
        const indexOfCurrentOption = currentOptions.indexOf(getCurrentOption);

        if (indexOfCurrentOption === -1) {
          cpyFilters[getSectionId] = [...currentOptions, getCurrentOption];
        } else {
          cpyFilters[getSectionId] = currentOptions.filter(
            (option) => option !== getCurrentOption
          );
        }

        // Remove empty arrays
        if (cpyFilters[getSectionId].length === 0) {
          delete cpyFilters[getSectionId];
        }
      }

      setFilters(cpyFilters);
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    },
    [filters]
  );

  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
      let getCartItems = cartItems.items || [];

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

  // ✅ FIXED: Improved filter initialization with proper URL parsing
  useEffect(() => {

    try {
      const savedFilters = JSON.parse(
        sessionStorage.getItem("filters") || "{}"
      );

      // ✅ FIX: Handle URL category parameter with comma-separated values
      if (categorySearchParam) {
        // Parse comma-separated categories from URL
        const categoryArray = categorySearchParam
          .split(",")
          .map((cat) => decodeURIComponent(cat.trim()))
          .filter((cat) => cat); // Remove empty strings

        // Merge with existing filters (preserve other filter types)
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

  // ✅ FIX 7: Debounced URL update with proper cleanup
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters && Object.keys(filters).length > 0) {
        const createQueryString = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(createQueryString));
      } else {
        setSearchParams(new URLSearchParams(""));
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, setSearchParams]);

  // ✅ FIX 8: Debounced product fetching with error handling
  useEffect(() => {
    if (filters !== null && sort !== null) {
      const timeout = setTimeout(() => {
        dispatch(
          fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
        );
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, sort, filters]);

  // Memoized product grid with mobile-responsive layout
  const productGrid = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 8 }, (_, index) => (
        <ProductSkeleton key={`skeleton-${index}`} />
      ));
    }

    if (!productList || productList.length === 0) {
      return <NoProducts />;
    }

    return productList.map((productItem) => (
      <Suspense
        key={productItem._id || productItem.id}
        fallback={<ProductSkeleton />}
      >
        <ShoppingProductTile
          product={productItem}
          handleAddtoCart={handleAddtoCart}
        />
      </Suspense>
    ));
  }, [productList, isLoading, handleAddtoCart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Layout Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
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
        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
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
            {/* Mobile-Responsive Header */}
            <div className="p-4 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Title and Count */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    All Products
                  </h1>
                  <p className="text-sm text-gray-600">
                    {productCount} {productCount === 1 ? "Product" : "Products"}{" "}
                    Found
                  </p>

                  {/* ✅ FIXED: Show active filters as separate removable tags */}
                  {Object.keys(filters).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, values]) =>
                        Array.isArray(values)
                          ? values.map((value) => (
                              <span
                                key={`${key}-${value}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                              >
                                <span className="font-medium">
                                  {key === "category"
                                    ? categoryOptionsMap[value] || value
                                    : value}
                                </span>
                                <button
                                  onClick={() => handleFilter(key, value)}
                                  className="hover:bg-blue-200 rounded-full p-1 transition-colors duration-200 ml-1"
                                  aria-label={`Remove ${value} filter`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))
                          : null
                      )}
                    </div>
                  )}
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
                          className="flex items-center gap-2 min-w-[140px] justify-start"
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
            </div>

            {/* Mobile-Responsive Product Grid */}
            <div className="p-4 sm:p-6">
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {productGrid}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ShoppingListing);
