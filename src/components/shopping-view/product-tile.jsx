// src/components/shopping-view/product-tile.jsx - MOBILE RESPONSIVE FIXES
import { memo, useState, useCallback, useMemo } from "react";
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

// Optimized badge component with mobile considerations
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

  if (product?.salePrice > 0) {
    return (
      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs px-2 py-1">
        Sale
      </Badge>
    );
  }

  return null;
});

ProductBadge.displayName = "ProductBadge";

// Main mobile-optimized product tile component
const ShoppingProductTile = memo(
  ({ product, handleGetProductDetails, handleAddtoCart }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);

    const handleImageLoad = useCallback(() => {
      setIsImageLoading(false);
    }, []);

    const handleProductClick = useCallback(() => {
      if (product?._id) {
        handleGetProductDetails(product._id);
      }
    }, [handleGetProductDetails, product?._id]);

    const handleCartClick = useCallback(
      (e) => {
        e.stopPropagation(); // Prevent triggering product details
        if (product?._id && product?.totalStock) {
          handleAddtoCart(product._id, product.totalStock);
        }
      },
      [handleAddtoCart, product?._id, product?.totalStock]
    );

    // Memoize price display logic with mobile-friendly formatting
    const priceDisplay = useMemo(() => {
      const price = Number(product?.price) || 0;
      const salePrice = Number(product?.salePrice) || 0;
      const isOnSale = salePrice > 0;
      const currentPrice = isOnSale ? salePrice : price;

      return {
        currentPrice,
        originalPrice: price,
        isOnSale,
        formattedCurrentPrice: `₹${currentPrice.toLocaleString("en-IN")}`,
        formattedOriginalPrice: `₹${price.toLocaleString("en-IN")}`,
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
        w-full mx-auto 
        hover:shadow-lg transition-all duration-300 ease-in-out
        transform hover:-translate-y-1
        border border-gray-200 hover:border-gray-300
      "
      >
        <div
          onClick={handleProductClick}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleProductClick();
            }
          }}
          aria-label={`View details for ${product?.title || "product"}`}
        >
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

          <CardContent className="p-3 sm:p-4">
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

            {/* Price Section - Mobile optimized layout */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span
                  className={`
                    ${
                      priceDisplay.isOnSale
                        ? "line-through text-gray-500 text-sm"
                        : "text-lg font-semibold text-[#6C3D1D]"
                    }
                  `}
                >
                  {priceDisplay.formattedOriginalPrice}
                </span>
                {priceDisplay.isOnSale && (
                  <span className="text-lg font-bold text-[#6C3D1D]">
                    {priceDisplay.formattedCurrentPrice}
                  </span>
                )}
              </div>

              {/* Savings indicator for mobile */}
              {priceDisplay.isOnSale && (
                <div className="text-xs text-green-600 font-medium">
                  Save ₹
                  {(
                    priceDisplay.originalPrice - priceDisplay.currentPrice
                  ).toLocaleString("en-IN")}
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
  }
);

ShoppingProductTile.displayName = "ShoppingProductTile";

export default ShoppingProductTile;
