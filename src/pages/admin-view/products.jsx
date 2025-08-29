// src/pages/admin-view/products.jsx - FIXED VERSION WITHOUT EXPORT ISSUES 🔥
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Package,
  Grid3x3,
  List,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from "lucide-react";

// Updated SimpleAdminProductTile component with 1:1 aspect ratio
function SimpleAdminProductTile({ product, onEdit, onDelete }) {
  const productImages = Array.isArray(product?.image)
    ? product.image.filter((img) => img)
    : [product?.image].filter((img) => img);

  const getStockStatus = () => {
    if (product?.totalStock === 0)
      return { text: "Out of Stock", color: "bg-red-500" };
    if (product?.totalStock < 10)
      return { text: `${product.totalStock} left`, color: "bg-orange-500" };
    return { text: "In Stock", color: "bg-green-500" };
  };

  const stockStatus = getStockStatus();
  const hasDiscount =
    product?.salePrice > 0 && product?.salePrice < product?.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-xl transition-all duration-300">
      <div className="relative">
        {/* 🔥 UPDATED: Square image container with 1:1 aspect ratio */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          {productImages.length > 0 ? (
            <img
              src={productImages[0]}
              alt={product?.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Badges positioned on the square image */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="bg-red-500 text-white text-xs">
                {discountPercent}% OFF
              </Badge>
            )}
            {productImages.length > 1 && (
              <Badge className="bg-blue-500 text-white text-xs">
                {productImages.length} images
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <Badge className={`${stockStatus.color} text-white text-xs`}>
              {stockStatus.text}
            </Badge>
          </div>
        </div>

        {/* Product info section - remains the same */}
        <div className="p-4">
          <h2 className="text-lg font-bold mb-1 line-clamp-2 min-h-[2.5rem]">
            {product?.title}
          </h2>
          <p className="text-sm text-gray-600 capitalize mb-3">
            {product?.category}
          </p>

          <div className="flex items-center justify-between mb-4">
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
          </div>

          <div className="flex gap-2">
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
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

const initialFormData = {
  image: [],
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Multi-image states
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState([]);

  const [currentEditedId, setCurrentEditedId] = useState(null);

  // Enhanced UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Sync uploaded URLs with form data
  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      const validUrls = uploadedImageUrls.filter((url) => url);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: validUrls,
      }));
    }
  }, [uploadedImageUrls]);

  function onSubmit(event) {
    event.preventDefault();

    const validImages = uploadedImageUrls.filter((url) => url);
    if (validImages.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...formData,
      image: validImages,
    };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: productData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({
            title: "Product Updated! ✅",
            description: "Product has been updated successfully.",
          });
        }
      });
    } else {
      dispatch(addNewProduct(productData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({
            title: "Product Added! ✅",
            description: "New product has been added successfully.",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(getCurrentProductId)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          toast({
            title: "Product Deleted ✅",
            description: "Product has been removed.",
          });
        }
      });
    }
  }

  function isFormValid() {
    const validImages = uploadedImageUrls.filter((url) => url);
    return (
      Object.keys(formData)
        .filter(
          (currentKey) =>
            currentKey !== "averageReview" && currentKey !== "image"
        )
        .map((key) => formData[key] !== "")
        .every((item) => item) && validImages.length > 0
    );
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFiles([]);
    setUploadedImageUrls([]);
    setImageLoadingStates([]);
    setCurrentEditedId(null);
    setOpenCreateProductsDialog(false);
  };

  const handleEdit = (product) => {
    setCurrentEditedId(product._id);

    // ✅ CRITICAL FIX: Handle image arrays properly
    let existingImages = [];

    if (Array.isArray(product.image)) {
      existingImages = product.image.filter(
        (img) => img && typeof img === "string" && img.trim() !== ""
      );
    } else if (product.image && typeof product.image === "string") {
      existingImages = [product.image];
    }

    // Set form data with existing values
    setFormData({
      image: existingImages, // ✅ Pass as array to form
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      totalStock: product.totalStock || "",
      averageReview: product.averageReview || 0,
    });

    // ✅ CRITICAL: Initialize image upload component with existing images
    if (existingImages.length > 0) {
      // Create array with existing images + empty slots
      const initialUrls = [...existingImages];
      while (initialUrls.length < 5) {
        initialUrls.push("");
      }

      setUploadedImageUrls(initialUrls);
      setImageFiles(new Array(5).fill(null));
      setImageLoadingStates(new Array(5).fill(false));
    } else {
      // No existing images - reset to empty state
      setUploadedImageUrls(new Array(5).fill(""));
      setImageFiles(new Array(5).fill(null));
      setImageLoadingStates(new Array(5).fill(false));
    }

    setOpenCreateProductsDialog(true);
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter and sort products
  const filteredProducts = productList
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      const matchesStock = showOutOfStock || product.totalStock > 0;
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-az":
          return a.title.localeCompare(b.title);
        case "name-za":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const categories = [
    ...new Set(productList.map((product) => product.category)),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Fragment>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your product catalog with multi-image support
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {filteredProducts.length} of {productList.length} products
              </Badge>
              <Button
                onClick={() => setOpenCreateProductsDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-az">Name A-Z</option>
                <option value="name-za">Name Z-A</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOutOfStock(!showOutOfStock)}
              >
                {showOutOfStock ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                {productList.length === 0
                  ? "Get started by adding your first product"
                  : "Try adjusting your search criteria"}
              </p>
              {productList.length === 0 && (
                <Button onClick={() => setOpenCreateProductsDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredProducts.map((productItem) => (
                <SimpleAdminProductTile
                  key={productItem._id}
                  product={productItem}
                  onEdit={() => handleEdit(productItem)}
                  onDelete={() => handleDelete(productItem._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Form Dialog */}
        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              resetForm();
            } else {
              setOpenCreateProductsDialog(isOpen);
            }
          }}
        >
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl overflow-auto"
          >
            <SheetHeader className="border-b pb-4 mb-6">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                {currentEditedId !== null ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>

            {/* Multi-Image Upload */}
            <div className="mb-8">
              <ProductImageUpload
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
                imageLoadingStates={imageLoadingStates}
                setImageLoadingStates={setImageLoadingStates}
                isEditMode={currentEditedId !== null} // ✅ Pass edit mode flag
                existingImages={currentEditedId ? formData.image : []} // ✅ Pass existing images
                setFormData={setFormData}
              />
            </div>

            {/* Product Form */}
            <div className="space-y-6">
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={
                  currentEditedId !== null ? "Update Product" : "Create Product"
                }
                formControls={addProductFormElements}
                isBtnDisabled={
                  !isFormValid() || imageLoadingStates.some((state) => state)
                }
              />
            </div>

            {/* Form Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Images uploaded:</span>
                <Badge
                  className={
                    uploadedImageUrls.filter((url) => url).length > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {uploadedImageUrls.filter((url) => url).length} / 5
                </Badge>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>
    </div>
  );
}

export default AdminProducts;
