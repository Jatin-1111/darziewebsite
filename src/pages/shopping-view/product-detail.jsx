// src/pages/shopping-view/product-detail.jsx - IMPROVED RESPONSIVE UI 🎨
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
  Plus,
  Minus,
  Package,
  Clock,
  Award,
  CheckCircle,
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

  // Fetch product details on mount
  useEffect(() => {
    if (productId) {
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

  // ✅ IMPROVED: Robust image handling
  const productImages = (() => {
    if (!productDetails?.image) return [];

    if (Array.isArray(productDetails.image)) {
      return productDetails.image.filter((img) => img && img.trim() !== "");
    } else if (
      typeof productDetails.image === "string" &&
      productDetails.image.trim() !== ""
    ) {
      return [productDetails.image.trim()];
    }
    return [];
  })();

  const hasMultipleImages = productImages.length > 1;
  const currentImage =
    productImages[selectedImage] ||
    productImages[0] ||
    "/placeholder-image.jpg";

  // Image navigation
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

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    if (!productDetails) return;

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="bg-gray-200 h-80 md:h-96 lg:h-[500px] rounded-2xl"></div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 h-20 w-20 rounded-xl"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-200 h-8 rounded-lg w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded-lg w-1/2"></div>
                <div className="bg-gray-200 h-20 rounded-lg"></div>
                <div className="bg-gray-200 h-12 rounded-lg w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/shop/listing")} size="lg">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Navigation */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Enhanced Breadcrumb */}
          <nav className="text-xs md:text-sm text-gray-600 mt-2 overflow-x-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span
                className="hover:text-gray-900 cursor-pointer transition-colors"
                onClick={() => navigate("/shop/home")}
              >
                Home
              </span>
              <span>/</span>
              <span
                className="hover:text-gray-900 cursor-pointer transition-colors"
                onClick={() => navigate("/shop/listing")}
              >
                Products
              </span>
              <span>/</span>
              <span
                className="hover:text-gray-900 cursor-pointer transition-colors"
                onClick={() =>
                  navigate(`/shop/listing?category=${productDetails.category}`)
                }
              >
                {categoryOptionsMap[productDetails.category] ||
                  productDetails.category}
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate max-w-32 md:max-w-none">
                {productDetails.title}
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div
                className="aspect-square cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  src={currentImage}
                  alt={`${productDetails.title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Enhanced Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {/* Enhanced Badges */}
              <div className="absolute top-3 md:top-4 left-3 md:left-4 space-y-2 space-x-2">
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white text-xs md:text-sm font-bold shadow-lg">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive" className="shadow-lg">
                    Out of Stock
                  </Badge>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge className="bg-orange-500 text-white shadow-lg">
                    Only {productDetails.totalStock} left
                  </Badge>
                )}
                {hasMultipleImages && (
                  <Badge className="bg-blue-500 text-white shadow-lg">
                    {selectedImage + 1} / {productImages.length}
                  </Badge>
                )}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex absolute top-3 md:top-4 right-3 md:right-4 gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="bg-white/90 backdrop-blur-sm shadow-lg"
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
                  className="bg-white/90 backdrop-blur-sm shadow-lg"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsImageModalOpen(true)}
                  className="bg-white/90 backdrop-blur-sm shadow-lg"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Enhanced Image Indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 ${
                        index === selectedImage
                          ? "bg-white shadow-lg"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      selectedImage === index
                        ? "border-blue-500 shadow-lg scale-105"
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

          {/* Enhanced Product Info */}
          <div className="space-y-6 lg:space-y-8">
            {/* Title and Category */}
            <div>
              <Badge variant="outline" className="mb-3 text-xs md:text-sm">
                {categoryOptionsMap[productDetails.category] ||
                  productDetails.category}
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                {productDetails.title}
              </h1>

              {/* Enhanced Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-sm md:text-base text-gray-600">
                  ({averageReview.toFixed(1)})
                </span>
                <span className="text-sm md:text-base text-gray-600">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>

            {/* Enhanced Price Section */}
            <div className="space-y-3 p-4 md:p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600">
                      ₹{productDetails.salePrice.toLocaleString()}
                    </span>
                    <span className="text-lg md:text-xl text-gray-500 line-through">
                      ₹{productDetails.price.toLocaleString()}
                    </span>
                    <Badge className="bg-green-500 text-white text-xs md:text-sm">
                      Save ₹
                      {(
                        productDetails.price - productDetails.salePrice
                      ).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    ₹{productDetails.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg md:text-xl mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {productDetails.description}
              </p>
            </div>

            {/* Enhanced Stock Status */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOutOfStock
                    ? "bg-red-500"
                    : isLowStock
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm md:text-base font-medium">
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                  ? `Only ${productDetails.totalStock} left in stock`
                  : "In Stock"}
              </span>
              {!isOutOfStock && (
                <Badge variant="outline" className="ml-auto">
                  <Package className="w-3 h-3 mr-1" />
                  {productDetails.totalStock} available
                </Badge>
              )}
            </div>

            {/* Enhanced Quantity and Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-4 md:space-y-6 p-4 md:p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="quantity"
                    className="text-sm md:text-base font-medium"
                  >
                    Quantity:
                  </Label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 md:w-20 text-center border-0 focus:ring-0 text-sm md:text-base"
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
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 md:h-14 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart • ₹
                  {(
                    (hasDiscount
                      ? productDetails.salePrice
                      : productDetails.price) * quantity
                  ).toLocaleString()}
                </Button>
              </div>
            )}

            {/* Enhanced Features */}
            <div className="grid grid-cols-2 gap-4 p-4 md:p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-600">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Reviews Section */}
        <div className="mt-12 md:mt-16 lg:mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                Customer Reviews
              </h2>
              <Badge variant="outline" className="ml-auto">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </Badge>
            </div>

            {/* Add Review Form */}
            {user && (
              <div className="mb-8 md:mb-10 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <h3 className="font-semibold text-base md:text-lg mb-4">
                  Write a Review
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block text-sm md:text-base">
                      Your Rating
                    </Label>
                    <div className="flex gap-1">
                      <StarRatingComponent
                        rating={rating}
                        handleRatingChange={setRating}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="review-message"
                      className="text-sm md:text-base"
                    >
                      Your Review
                    </Label>
                    <Input
                      id="review-message"
                      value={reviewMsg}
                      onChange={(e) => setReviewMsg(e.target.value)}
                      placeholder="Tell others about your experience..."
                      className="mt-2 text-sm md:text-base"
                    />
                  </div>
                  <Button
                    onClick={handleAddReview}
                    disabled={
                      isSubmittingReview || !rating || !reviewMsg.trim()
                    }
                    className="text-sm md:text-base"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Review
                      </>
                    )}
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
                      <Avatar className="w-10 h-10 md:w-12 md:h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm md:text-base">
                          {review.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                          <h4 className="font-semibold text-sm md:text-base">
                            {review.userName}
                          </h4>
                          <div className="flex items-center">
                            <StarRatingComponent rating={review.reviewValue} />
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                          {review.reviewMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 md:py-16">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsImageModalOpen(false)}
        >
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

            {/* Enhanced Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="fixed top-4 right-4 md:top-6 md:right-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 md:p-4 transition-all duration-200 z-10 border border-white/20"
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

            {/* Enhanced Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="fixed left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 md:p-4 transition-all duration-200 z-10 border border-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="fixed right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 md:p-4 transition-all duration-200 z-10 border border-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}

            {/* Enhanced Image Counter */}
            {hasMultipleImages && (
              <div className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium z-10 border border-white/20">
                {selectedImage + 1} / {productImages.length}
              </div>
            )}

            {/* Enhanced Instructions */}
            <div className="hidden md:block fixed bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm z-10 border border-white/20">
              <p>
                Click image to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Navigation */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "Escape") setIsImageModalOpen(false);
          }}
          tabIndex={-1}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
