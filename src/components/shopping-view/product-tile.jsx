"use client";

// src/components/shopping-view/product-tile.jsx - ENHANCED UI WITH MODERN DESIGN 🎨✨
import store from "@/store/store";
import { openLoginModal } from "@/store/auth-slice/modal-slice";
import { memo, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShoppingCart, Heart } from "lucide-react";

// Optimized image component with enhanced visual effects
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
    <div
      className="relative w-full overflow-hidden rounded-t-xl group"
      style={{ aspectRatio: "3/4" }}
    >
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
        </div>
      )}
      {imageError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-3xl mb-3">🖼️</div>
            <span className="text-sm font-medium">Image unavailable</span>
          </div>
        </div>
      ) : (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src || "/placeholder-image.jpg"}
            alt={alt || "Product image"}
            className={`
              absolute inset-0 h-full w-full object-cover
              transition-all duration-500 ease-out
              group-hover:scale-105
              ${!imageLoaded ? "opacity-0" : "opacity-100"}
              ${className}
            `}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}

      {/* Enhanced overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// Enhanced badge component with responsive styling
const ProductBadge = memo(({ product }) => {
  if (product?.totalStock === 0) {
    return (
      <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 shadow-lg backdrop-blur-sm font-semibold">
        Out Of Stock
      </Badge>
    );
  }

  const price = Number(product?.price) || 0;
  const salePrice = Number(product?.salePrice) || 0;
  const isOnSale = salePrice > 0 && salePrice < price;

  if (isOnSale) {
    const discountPercent = Math.round(((price - salePrice) / price) * 100);
    return (
      <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 shadow-lg backdrop-blur-sm font-bold animate-pulse">
        {discountPercent}% OFF
      </Badge>
    );
  }

  return null;
});

ProductBadge.displayName = "ProductBadge";

// Main enhanced product tile component with premium UI
const ShoppingProductTile = memo(({ product, handleAddtoCart }) => {
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  // Navigate to dedicated product page
  const handleProductClick = useCallback(() => {
    if (product?._id) {
      navigate(`/shop/product/${product._id}`);
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

  const handleFavoriteClick = useCallback(
    (e) => {
      e.stopPropagation();
      setIsFavorite(!isFavorite);
    },
    [isFavorite]
  );

  // Enhanced price display logic
  const priceDisplay = useMemo(() => {
    const originalPrice = Number(product?.price) || 0;
    const salePrice = Number(product?.salePrice) || 0;

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
        w-full max-w-none group
        transition-all duration-500 ease-out
        transform hover:-translate-y-2
        border-0 shadow-md hover:shadow-xl
        bg-white
        flex flex-col cursor-pointer
        rounded-xl overflow-hidden
        relative
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <div className="flex-1 flex flex-col relative">
        {/* Enhanced image with hover effects */}
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={product?.image}
            alt={product?.title || "Product image"}
            onLoad={handleImageLoad}
          />
          <ProductBadge product={product} />

          {/* Favorite button with smooth animation */}
          <button
            onClick={handleFavoriteClick}
            className={`
              absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm
              transition-all duration-300 transform
              ${isHovered ? "scale-100 opacity-100" : "scale-90 opacity-80"}
              ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }
              shadow-lg hover:shadow-xl hover:scale-110
            `}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isFavorite ? "fill-current scale-110" : ""
              }`}
            />
          </button>

          {isImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-t-xl"></div>
          )}
        </div>

        {/* Enhanced content section with responsive spacing */}
        <CardContent className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50">
          {/* Product Title with responsive typography */}
          <h2
            className="
              text-xs sm:text-sm md:text-base font-bold mb-2 sm:mb-3 text-gray-900
              leading-tight line-clamp-2
              hover:text-[#6C3D1D] transition-colors duration-200
              min-h-[2rem] sm:min-h-[2.5rem] flex items-center
              group-hover:text-[#5A321A]
            "
            title={product?.title}
          >
            {product?.title || "Untitled Product"}
          </h2>

          {/* Enhanced price section with responsive sizing */}
          <div className="flex items-center justify-center">
            {priceDisplay.isOnSale ? (
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                  <span className="text-sm sm:text-lg md:text-xl font-bold text-green-600">
                    {priceDisplay.formattedCurrentPrice}
                  </span>
                  <span className="line-through text-gray-400 text-xs sm:text-sm">
                    {priceDisplay.formattedOriginalPrice}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-green-600 font-medium">
                  You save {priceDisplay.formattedSavings}
                </div>
              </div>
            ) : (
              <span className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#6C3D1D] transition-colors duration-200">
                {priceDisplay.formattedCurrentPrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Enhanced footer with premium button design */}
      <CardFooter className="p-3 bg-gray-50/80 backdrop-blur-sm">
        <Button
          onClick={handleCartClick}
          className={`
            w-full h-11 text-sm font-semibold
            transition-all duration-300 ease-out
            transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl
            ${
              isOutOfStock
                ? "opacity-60 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                : `
                bg-gradient-to-r from-[#6C3D1D] to-[#5A321A] 
                hover:from-[#5A321A] hover:to-[#4A2817]
                text-white border-0
                hover:shadow-2xl hover:shadow-[#6C3D1D]/25
              `
            }
          `}
          disabled={isOutOfStock}
          aria-label={
            isOutOfStock
              ? "Out of stock"
              : `Add ${product?.title || "product"} to cart`
          }
        >
          {isOutOfStock ? (
            "Out Of Stock"
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </div>
          )}
        </Button>
      </CardFooter>

      {/* Subtle shine effect on hover */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-[shine_0.8s_ease-out] pointer-events-none" /> */}
    </Card>
  );
});

ShoppingProductTile.displayName = "ShoppingProductTile";

export default ShoppingProductTile;
