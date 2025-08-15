// src/pages/shopping-view/product-detail.jsx - DEDICATED PRODUCT PAGE
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

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
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
  }, [user, productDetails, cartItems, quantity, dispatch, toast, navigate]);

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

  // Handle case where image might be a string or array
  const productImages = Array.isArray(productDetails.image)
    ? productDetails.image
    : [productDetails.image].filter(Boolean);

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

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={
                  productImages[selectedImage] ||
                  productImages[0] ||
                  "/placeholder-image.jpg"
                }
                alt={productDetails.title}
                className="w-full h-full object-cover"
              />

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
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productDetails.title} ${index + 1}`}
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
