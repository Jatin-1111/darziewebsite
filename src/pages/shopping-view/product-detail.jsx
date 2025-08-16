// src/pages/shopping-view/product-detail.jsx - UPDATED FOR MULTI-IMAGE SUPPORT 🔥
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { categoryOptionsMap } from "@/config";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import StarRatingComponent from "@/components/common/star-rating";
import { openLoginModal } from "@/store/auth-slice/modal-slice";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // State
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Redux state
  const { productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  // Fetch product details on mount and scroll to top
  useEffect(() => {
    if (productId) {
      // ✅ FIX: Scroll to top when product detail page loads
      window.scrollTo(0, 0);

      dispatch(fetchProductDetails(productId));
      dispatch(getReviews(productId));
    }
  }, [dispatch, productId]);

  // Calculate average review
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // ✅ FIXED: Handle multiple images properly
  const productImages = (() => {
    if (!productDetails?.image) return [];

    // If it's already an array, filter out empty strings
    if (Array.isArray(productDetails.image)) {
      return productDetails.image.filter((img) => img && img.trim() !== "");
    }

    // If it's a string, convert to array
    if (
      typeof productDetails.image === "string" &&
      productDetails.image.trim() !== ""
    ) {
      return [productDetails.image.trim()];
    }

    // Fallback to empty array
    return [];
  })();

  useEffect(() => {
    if (selectedImage >= productImages.length && productImages.length > 0) {
      setSelectedImage(0);
    }
  }, [productImages.length, selectedImage]);

  const hasMultipleImages = productImages.length > 1;
  const currentImage =
    productImages[selectedImage] ||
    productImages[0] ||
    "/placeholder-image.jpg";

  // Navigation handlers for image gallery
  const nextImage = useCallback(() => {
    if (productImages.length > 1) {
      setSelectedImage((prev) => (prev + 1) % productImages.length);
    }
  }, [productImages.length]);

  const prevImage = useCallback(() => {
    if (productImages.length > 1) {
      setSelectedImage(
        (prev) => (prev - 1 + productImages.length) % productImages.length
      );
    }
  }, [productImages.length]);

  // Keyboard navigation for images and body scroll lock
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") setIsImageModalOpen(false);
    };

    if (isImageModalOpen) {
      // ✅ FIX: Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
        // ✅ FIX: Restore body scroll when modal closes
        document.body.style.overflow = "unset";
      };
    }
  }, [isImageModalOpen, nextImage, prevImage]);

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    // 🔥 NEW: Show login modal instead of toast + navigate
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    if (!productDetails) return;

    // Check if product is already in cart
    const existingCartItem = cartItems?.items?.find(
      (item) => item.productId === productDetails._id
    );

    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;

    if (currentQuantity + quantity > productDetails.totalStock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${
          productDetails.totalStock - currentQuantity
        } more items can be added`,
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await dispatch(
        addToCart({
          userId: user.id,
          productId: productDetails._id,
          quantity: quantity,
        })
      ).unwrap();

      if (result.success) {
        dispatch(fetchCartItems(user.id));
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} ${
            quantity === 1 ? "item" : "items"
          } added to your cart`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    }
  }, [user, productDetails, cartItems, quantity, dispatch, toast]);

  // Handle review submission
  const handleAddReview = useCallback(async () => {
    if (!user) {
      toast({
        title: "Please log in to review",
        variant: "destructive",
      });
      return;
    }

    if (!rating || !reviewMsg.trim()) {
      toast({
        title: "Please provide rating and review message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      const result = await dispatch(
        addReview({
          productId: productDetails._id,
          userId: user.id,
          userName: user.userName,
          reviewMessage: reviewMsg.trim(),
          reviewValue: rating,
        })
      ).unwrap();

      if (result.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast({
          title: "Review Added! ⭐",
          description: "Thank you for your feedback",
        });
      }
    } catch (error) {
      toast({
        title: "Review Failed",
        description: error.message || "Failed to add review",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  }, [user, rating, reviewMsg, productDetails, dispatch, toast]);

  // Share product
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: productDetails?.title,
        text: `Check out this amazing product: ${productDetails?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  }, [productDetails, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 h-20 w-20 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-200 h-8 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
                <div className="bg-gray-200 h-12 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/shop/listing")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = productDetails.totalStock === 0;
  const isLowStock =
    productDetails.totalStock < 10 && productDetails.totalStock > 0;
  const hasDiscount =
    productDetails.salePrice > 0 &&
    productDetails.salePrice < productDetails.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((productDetails.price - productDetails.salePrice) /
          productDetails.price) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600">
            <span
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => navigate("/shop/home")}
            >
              Home
            </span>
            <span className="mx-2">/</span>
            <span
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => navigate("/shop/listing")}
            >
              Products
            </span>
            <span className="mx-2">/</span>
            <span
              className="hover:text-gray-900 cursor-pointer"
              onClick={() =>
                navigate(`/shop/listing?category=${productDetails.category}`)
              }
            >
              {categoryOptionsMap[productDetails.category] ||
                productDetails.category}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {productDetails.title}
            </span>
          </nav>
        </div>
      </div>
      
      {productDetails && (
        <div className="fixed top-20 right-4 bg-red-100 p-4 rounded text-xs max-w-xs z-50">
          <h4>🔍 DEBUG:</h4>
          <p>Type: {typeof productDetails.image}</p>
          <p>IsArray: {Array.isArray(productDetails.image).toString()}</p>
          <p>
            Length:{" "}
            {Array.isArray(productDetails.image)
              ? productDetails.image.length
              : "N/A"}
          </p>
          <p>Value: {JSON.stringify(productDetails.image)}</p>
        </div>
      )}

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ✅ ENHANCED: Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden group">
              <div
                className="aspect-square cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  src={currentImage}
                  alt={`${productDetails.title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Image Navigation Arrows - Only show if multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge className="bg-orange-500 text-white">
                    Only {productDetails.totalStock} left
                  </Badge>
                )}
                {hasMultipleImages && (
                  <Badge className="bg-blue-500 text-white">
                    {selectedImage + 1} / {productImages.length}
                  </Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleShare}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsImageModalOpen(true)}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Image indicator dots */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === selectedImage
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images - Only show if multiple images */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                      selectedImage === index
                        ? "border-primary shadow-lg"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productDetails.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <Badge variant="outline" className="mb-2">
                {categoryOptionsMap[productDetails.category] ||
                  productDetails.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productDetails.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-sm text-gray-600">
                  ({averageReview.toFixed(1)}) • {reviews.length} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ₹{productDetails.salePrice.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{productDetails.price.toLocaleString()}
                    </span>
                    <Badge className="bg-green-500 text-white">
                      Save ₹
                      {(
                        productDetails.price - productDetails.salePrice
                      ).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    ₹{productDetails.price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {productDetails.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOutOfStock
                    ? "bg-red-500"
                    : isLowStock
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm">
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                  ? `Only ${productDetails.totalStock} left in stock`
                  : "In Stock"}
              </span>
            </div>

            {/* Image Gallery Info */}
            {hasMultipleImages && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Gallery</h4>
                <p className="text-blue-800 text-sm">
                  This product has {productImages.length} images. Use the
                  thumbnails below or click the main image to view all angles.
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center border-0"
                      min="1"
                      max={productDetails.totalStock}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity(
                          Math.min(productDetails.totalStock, quantity + 1)
                        )
                      }
                      disabled={quantity >= productDetails.totalStock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Enhanced Image Modal for Better Desktop Experience */}
        {isImageModalOpen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsImageModalOpen(false)}
            style={{
              // Prevent body scroll when modal is open
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {/* Modal Container */}
            <div
              className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image Container */}
              <div className="relative max-w-7xl max-h-full flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={`${productDetails.title} - Full view`}
                  className="max-w-full max-h-full object-contain cursor-zoom-out"
                  onClick={() => setIsImageModalOpen(false)}
                  style={{
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                  }}
                />
              </div>

              {/* Close button - Fixed position */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="fixed top-4 right-4 md:top-8 md:right-8 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 md:p-4 transition-all duration-200 z-10"
                aria-label="Close image viewer"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation arrows - Only show if multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 md:p-4 transition-all duration-200 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 md:p-4 transition-all duration-200 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </>
              )}

              {/* Image counter - Fixed position */}
              {hasMultipleImages && (
                <div className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium z-10">
                  {selectedImage + 1} / {productImages.length}
                </div>
              )}

              {/* Instructions for desktop users */}
              <div className="hidden md:block fixed bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-10">
                <p>Press ESC to close • Click image to close</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            {/* Add Review Form */}
            {user && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Your Rating</Label>
                    <div className="flex gap-1">
                      <StarRatingComponent
                        rating={rating}
                        handleRatingChange={setRating}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review-message">Your Review</Label>
                    <Input
                      id="review-message"
                      value={reviewMsg}
                      onChange={(e) => setReviewMsg(e.target.value)}
                      placeholder="Tell others about your experience..."
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={handleAddReview}
                    disabled={
                      isSubmittingReview || !rating || !reviewMsg.trim()
                    }
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {review.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{review.userName}</h4>
                          <div className="flex items-center">
                            <StarRatingComponent rating={review.reviewValue} />
                          </div>
                        </div>
                        <p className="text-gray-700">{review.reviewMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
