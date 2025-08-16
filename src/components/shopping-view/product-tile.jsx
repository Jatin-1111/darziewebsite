// src/components/shopping-view/product-tile.jsx - UPDATED FOR NAVIGATION
import store from "@/store/store";
import { openLoginModal } from "@/store/auth-slice/modal-slice";
import { memo, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // NEW
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

// Optimized image component with mobile-first responsive design
const OptimizedImage = memo(({ src, alt, className, onLoad, onError }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  // Safely generate WebP source URL
  const webpSrc = useMemo(() => {
    if (!src || typeof src !== "string") return null;
    return src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  }, [src]);

  return (
    <div className="relative overflow-hidden rounded-t-lg">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      {imageError ? (
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-100 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <span className="text-sm">Image not available</span>
          </div>
        </div>
      ) : (
        <picture>
          {/* WebP format for better compression */}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src || "/placeholder-image.jpg"}
            alt={alt || "Product image"}
            className={`
              w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover
              transition-all duration-300 ease-in-out
              ${!imageLoaded ? "opacity-0" : "opacity-100"}
              ${className}
            `}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            width="300"
            height="300"
          />
        </picture>
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// Fixed badge component with correct price logic
const ProductBadge = memo(({ product }) => {
  if (product?.totalStock === 0) {
    return (
      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs px-2 py-1">
        Out Of Stock
      </Badge>
    );
  }

  if (product?.totalStock < 10) {
    return (
      <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-xs px-2 py-1">
        Only {product.totalStock} left
      </Badge>
    );
  }

  // Fixed: Sale badge shows when salePrice is LESS than price
  const price = Number(product?.price) || 0;
  const salePrice = Number(product?.salePrice) || 0;
  const isOnSale = salePrice > 0 && salePrice < price;

  if (isOnSale) {
    const discountPercent = Math.round(((price - salePrice) / price) * 100);
    return (
      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs px-2 py-1">
        {discountPercent}% OFF
      </Badge>
    );
  }

  return null;
});

ProductBadge.displayName = "ProductBadge";

// Main mobile-optimized product tile component - UPDATED FOR NAVIGATION
const ShoppingProductTile = memo(({ product, handleAddtoCart }) => {
  // REMOVED handleGetProductDetails
  const navigate = useNavigate(); // NEW
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  // UPDATED: Navigate to dedicated product page instead of opening modal
  const handleProductClick = useCallback(() => {
    if (product?._id) {
      navigate(`/shop/product/${product._id}`); // NEW - Navigate to dedicated page
    }
  }, [navigate, product?._id]);

  const handleCartClick = useCallback(
    (e) => {
      e.stopPropagation();

      const { isAuthenticated } = store.getState().auth;

      if (!isAuthenticated) {
        store.dispatch(openLoginModal());
        return;
      }

      if (product?._id && product?.totalStock) {
        handleAddtoCart(product._id, product.totalStock);
      }
    },
    [handleAddtoCart, product?._id, product?.totalStock]
  );

  // FIXED: Corrected price display logic based on your data structure
  const priceDisplay = useMemo(() => {
    const originalPrice = Number(product?.price) || 0;
    const salePrice = Number(product?.salePrice) || 0;

    // Sale exists when salePrice > 0 AND salePrice < originalPrice
    const isOnSale = salePrice > 0 && salePrice < originalPrice;
    const currentPrice = isOnSale ? salePrice : originalPrice;
    const savings = isOnSale ? originalPrice - salePrice : 0;

    return {
      currentPrice,
      originalPrice,
      isOnSale,
      savings,
      formattedCurrentPrice: `₹${currentPrice.toLocaleString("en-IN")}`,
      formattedOriginalPrice: `₹${originalPrice.toLocaleString("en-IN")}`,
      formattedSavings: `₹${savings.toLocaleString("en-IN")}`,
    };
  }, [product?.price, product?.salePrice]);

  const isOutOfStock = product?.totalStock === 0;

  // Early return if no product data
  if (!product) {
    return (
      <Card className="w-full mx-auto">
        <div className="p-4 text-center text-gray-500">
          Product data unavailable
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="
        w-full max-w-sm mx-auto 
        min-h-[400px] sm:min-h-[450px] md:min-h-[480px]
        hover:shadow-lg transition-all duration-300 ease-in-out
        transform hover:-translate-y-1
        border border-gray-200 hover:border-gray-300
        flex flex-col cursor-pointer
      "
      onClick={handleProductClick} // UPDATED: Click entire card to navigate
    >
      <div className="flex-1 flex flex-col">
        <div className="relative">
          <OptimizedImage
            src={product?.image}
            alt={product?.title || "Product image"}
            onLoad={handleImageLoad}
          />
          <ProductBadge product={product} />
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg"></div>
          )}
        </div>

        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
          {/* Product Title - Mobile optimized with proper line clamping */}
          <h2
            className="
                text-base sm:text-lg font-bold mb-2 
                leading-tight line-clamp-2
                hover:text-[#6C3D1D] transition-colors
                min-h-[2.5rem] sm:min-h-[3rem]
              "
            title={product?.title}
          >
            {product?.title || "Untitled Product"}
          </h2>

          {/* Category - Mobile friendly */}
          <div className="mb-3">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {categoryOptionsMap[product?.category] ||
                product?.category ||
                "Uncategorized"}
            </span>
          </div>

          {/* FIXED: Price Section with correct logic */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              {priceDisplay.isOnSale ? (
                <>
                  {/* Show discounted price prominently */}
                  <span className="text-lg font-bold text-[#6C3D1D]">
                    {priceDisplay.formattedCurrentPrice}
                  </span>
                  {/* Show original price crossed out */}
                  <span className="line-through text-gray-500 text-sm">
                    {priceDisplay.formattedOriginalPrice}
                  </span>
                </>
              ) : (
                /* No sale - show regular price */
                <span className="text-lg font-semibold text-[#6C3D1D]">
                  {priceDisplay.formattedCurrentPrice}
                </span>
              )}
            </div>

            {/* Savings indicator for mobile */}
            {priceDisplay.isOnSale && (
              <div className="text-xs text-green-600 font-medium">
                Save {priceDisplay.formattedSavings}
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          onClick={handleCartClick}
          className={`
              w-full h-10 sm:h-11 text-sm sm:text-base
              transition-all duration-200 ease-in-out
              ${
                isOutOfStock
                  ? "opacity-60 cursor-not-allowed bg-gray-400"
                  : "bg-[#6C3D1D] hover:bg-[#5A321A] active:scale-95 hover:shadow-md"
              }
            `}
          disabled={isOutOfStock}
          aria-label={
            isOutOfStock
              ? "Out of stock"
              : `Add ${product?.title || "product"} to cart`
          }
        >
          {isOutOfStock ? "Out Of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
});

ShoppingProductTile.displayName = "ShoppingProductTile";

export default ShoppingProductTile;
