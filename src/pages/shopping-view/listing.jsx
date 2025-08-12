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

// Lazy load heavy components
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

// Memoized loading skeleton component
const ProductSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-[300px] rounded-lg mb-2"></div>
    <div className="bg-gray-200 h-4 rounded mb-2"></div>
    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
  </div>
));

ProductSkeleton.displayName = "ProductSkeleton";

// Memoized no products component
const NoProducts = memo(() => (
  <div className="col-span-full text-center py-12">
    <div className="text-6xl mb-4">🔍</div>
    <p className="text-xl text-gray-500 mb-2">No products found</p>
    <p className="text-gray-400">Try adjusting your filters</p>
  </div>
));

NoProducts.displayName = "NoProducts";

// Optimized search params helper with memoization
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

// Main component with performance optimizations
function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh"); // Set default to avoid null state
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

  // Memoized product grid
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
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <Suspense
        fallback={
          <div className="bg-gray-100 h-96 rounded-lg animate-pulse"></div>
        }
      >
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </Suspense>

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productCount} Products
            </span>
            <Suspense
              fallback={
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              }
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productGrid}
        </div>
      </div>

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
