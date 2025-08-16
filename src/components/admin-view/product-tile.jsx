// src/components/admin-view/product-tile.jsx - ENHANCED WITH MULTI-IMAGE SUPPORT 🔥
import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  AlertTriangle,
  CheckCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function AdminProductTile({ product, onEdit, onDelete, viewMode = "grid" }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Handle multiple images
  const productImages = Array.isArray(product?.image)
    ? product.image.filter((img) => img)
    : [product?.image].filter((img) => img);

  const hasMultipleImages = productImages.length > 1;

  // Navigate images
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  }, [productImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  }, [productImages.length]);

  // Stock status
  const getStockStatus = () => {
    if (product?.totalStock === 0)
      return { text: "Out of Stock", color: "bg-red-500" };
    if (product?.totalStock < 10)
      return { text: `${product.totalStock} left`, color: "bg-orange-500" };
    return { text: "In Stock", color: "bg-green-500" };
  };

  const stockStatus = getStockStatus();

  // Price display
  const hasDiscount =
    product?.salePrice > 0 && product?.salePrice < product?.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (viewMode === "list") {
    return (
      <Card className="w-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image Section */}
            <div className="relative w-24 h-24 flex-shrink-0">
              {imageError || productImages.length === 0 ? (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              ) : (
                <>
                  <img
                    src={productImages[currentImageIndex]}
                    alt={product?.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={handleImageError}
                  />
                  {hasMultipleImages && (
                    <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5">
                      {productImages.length}
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {product?.title}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {product?.category}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          ₹{product?.salePrice?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product?.price?.toLocaleString()}
                        </span>
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {discountPercent}% OFF
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{product?.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge className={`${stockStatus.color} text-white text-xs`}>
                    {stockStatus.text}
                  </Badge>
                  {product?.averageReview > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">
                        {product.averageReview.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {/* Image Section with Navigation */}
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          {imageError || productImages.length === 0 ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No image available</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={productImages[currentImageIndex]}
                alt={product?.title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={handleImageError}
              />

              {/* Multi-image Navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="bg-red-500 text-white text-xs">
                {discountPercent}% OFF
              </Badge>
            )}
            {hasMultipleImages && (
              <Badge className="bg-blue-500 text-white text-xs flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {productImages.length}
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <Badge className={`${stockStatus.color} text-white text-xs`}>
              {stockStatus.text}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Category */}
          <div className="mb-3">
            <h2 className="text-lg font-bold mb-1 line-clamp-2 min-h-[2.5rem]">
              {product?.title}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {product?.category}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-green-600">
                    ₹{product?.salePrice?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product?.price?.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-semibold text-gray-900">
                  ₹{product?.price?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Rating */}
            {product?.averageReview > 0 && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-yellow-700">
                  {product.averageReview.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>Stock: {product?.totalStock}</span>
            </div>
            {product?.totalStock < 10 && product?.totalStock > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Stock</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            onClick={onEdit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
