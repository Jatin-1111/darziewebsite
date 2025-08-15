// src/pages/shopping-view/listing.jsx - MOBILE RESPONSIVE UPDATE
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
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// Lazy load components
const ProductFilter = lazy(() => import("@/components/shopping-view/filter"));
const ProductDetailsDialog = lazy(() =>
  import("@/components/shopping-view/product-details")
);
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

// Optimized search params helper
const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
};

// Main mobile-responsive component
function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  // Memoize expensive calculations
  const productCount = useMemo(() => productList?.length || 0, [productList]);

  // Debounced filter application
  const [filterTimeout, setFilterTimeout] = useState(null);

  // Optimized handlers with useCallback
  const handleSort = useCallback((value) => {
    setSort(value);
  }, []);

  const handleFilter = useCallback(
    (getSectionId, getCurrentOption) => {
      let cpyFilters = { ...filters };

      if (getSectionId === "Price") {
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
      }

      setFilters(cpyFilters);
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    },
    [filters]
  );

  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
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

  // Initialize filters and sort on mount
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters"));
    if (
      categorySearchParam &&
      !savedFilters?.Category?.includes(categorySearchParam)
    ) {
      setFilters((prev) => ({
        ...prev,
        Category: [categorySearchParam],
      }));
    } else {
      setFilters(savedFilters || {});
    }
  }, [categorySearchParam]);

  // Debounced URL update
  useEffect(() => {
    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }

    const timeout = setTimeout(() => {
      if (filters && Object.keys(filters).length > 0) {
        const createQueryString = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(createQueryString));
      } else {
        setSearchParams(new URLSearchParams(""));
      }
    }, 300);

    setFilterTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [filters, setSearchParams]);

  // Debounced product fetching
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

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
          handleGetProductDetails={handleGetProductDetails}
          product={productItem}
          handleAddtoCart={handleAddtoCart}
        />
      </Suspense>
    ));
  }, [productList, isLoading, handleGetProductDetails, handleAddtoCart]);

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
              <div
                className="
  grid gap-6 sm:gap-8
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3
"
              >
                {productGrid}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Suspense fallback={null}>
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
          handleAddtoCart={handleAddtoCart}
        />
      </Suspense>
    </div>
  );
}

export default memo(ShoppingListing);
