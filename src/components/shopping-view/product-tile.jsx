import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

// Optimized image component with lazy loading and WebP support
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
    <div className="relative overflow-hidden">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      {imageError ? (
        <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-400">
          <span>Image not available</span>
        </div>
      ) : (
        <picture>
          {/* WebP format for better compression - only if webpSrc is valid */}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src || "/placeholder-image.jpg"}
            alt={alt || "Product image"}
            className={`${className} ${
              !imageLoaded ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
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

// Optimized badge component
const ProductBadge = memo(({ product }) => {
  if (product?.totalStock === 0) {
    return (
      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
        Out Of Stock
      </Badge>
    );
  }

  if (product?.totalStock < 10) {
    return (
      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
        Only {product.totalStock} left
      </Badge>
    );
  }

  if (product?.salePrice > 0) {
    return (
      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
        Sale
      </Badge>
    );
  }

  return null;
});

ProductBadge.displayName = "ProductBadge";

// Main optimized product tile component
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

    // Memoize price display logic with safe number handling
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
        <Card className="w-full max-w-sm mx-auto">
          <div className="p-4 text-center text-gray-500">
            Product data unavailable
          </div>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300">
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
              className="w-full h-[300px] object-cover rounded-t-lg"
              onLoad={handleImageLoad}
            />
            <ProductBadge product={product} />
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg"></div>
            )}
          </div>

          <CardContent className="p-4">
            <h2
              className="text-xl font-bold mb-2 line-clamp-2"
              title={product?.title}
            >
              {product?.title || "Untitled Product"}
            </h2>

            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] text-muted-foreground">
                {categoryOptionsMap[product?.category] ||
                  product?.category ||
                  "Uncategorized"}
              </span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  priceDisplay.isOnSale ? "line-through text-gray-500" : ""
                } text-lg font-semibold text-primary`}
              >
                {priceDisplay.formattedOriginalPrice}
              </span>
              {priceDisplay.isOnSale && (
                <span className="text-lg font-semibold text-primary">
                  {priceDisplay.formattedCurrentPrice}
                </span>
              )}
            </div>
          </CardContent>
        </div>

        <CardFooter>
          <Button
            onClick={handleCartClick}
            className={`w-full ${
              isOutOfStock
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? "Out of stock"
                : `Add ${product?.title || "product"} to cart`
            }
          >
            {isOutOfStock ? "Out Of Stock" : "Add to cart"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ShoppingProductTile.displayName = "ShoppingProductTile";

export default ShoppingProductTile;
