// src/components/admin-view/image-upload.jsx - DRAG & DROP ENHANCED 🔥💫

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { API_ENDPOINTS } from "../../config/api";
import apiClient from "../../utils/apiClient";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloudIcon,
  XIcon,
  ImageIcon,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  FileImage,
  Upload,
} from "lucide-react";

// Grid Pattern Component
const GridPattern = () => {
  const columns = 41;
  const rows = 11;

  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
};

// Individual Image Card Component
const ImageCard = ({ image, index, onRemove, isLoading, error, onRetry }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white dark:bg-neutral-900",
        "flex flex-col items-start justify-start h-32 p-4 w-full mx-auto rounded-lg",
        "shadow-lg border border-gray-200 dark:border-neutral-700 transition-all duration-200",
        error ? "border-red-300 bg-red-50" : ""
      )}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
            />
            <p className="text-xs text-gray-600">Uploading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-2">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-red-600 mb-2 text-center">
              {error.message}
            </p>
            {error.canRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRetry(index)}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full group">
            {typeof image === "string" ? (
              // Uploaded image URL
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover rounded-md transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              // File preview
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover rounded-md transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            )}

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
            )}

            {/* Remove button */}
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Remove image"
            >
              <XIcon className="w-3 h-3" />
            </button>

            {/* Main image indicator */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                Main
              </div>
            )}
          </div>

          {/* Image info */}
          <div className="flex justify-between w-full items-center gap-2 mt-2">
            <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate flex-1">
              {typeof image === "string" ? "Uploaded" : image.name}
            </p>
            {typeof image !== "string" && (
              <p className="text-xs text-neutral-600 dark:text-white bg-gray-100 dark:bg-neutral-800 px-1 py-0.5 rounded">
                {(image.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  imageLoadingStates = [],
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingStates,
  isEditMode = false,
  setFormData,
  existingImages = [],
}) {
  const inputRef = useRef(null);
  const [uploadErrors, setUploadErrors] = useState({});
  const [retryCount, setRetryCount] = useState({});
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const { toast } = useToast();

  const MAX_IMAGES = 5;
  const MAX_RETRIES = 3;

  // Initialize with existing images in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      existingImages &&
      existingImages.length > 0 &&
      uploadedImageUrls.length === 0
    ) {
      const validExistingImages = existingImages.filter(
        (img) =>
          img &&
          typeof img === "string" &&
          img.trim() !== "" &&
          (img.startsWith("http") || img.startsWith("data:"))
      );

      if (validExistingImages.length > 0) {
        const initialUrls = [...validExistingImages];
        while (initialUrls.length < MAX_IMAGES) {
          initialUrls.push("");
        }

        setUploadedImageUrls(initialUrls);

        if (setImageLoadingStates) {
          setImageLoadingStates(new Array(MAX_IMAGES).fill(false));
        }
      }
    }
  }, [
    isEditMode,
    existingImages,
    setUploadedImageUrls,
    setImageLoadingStates,
    uploadedImageUrls.length,
  ]);

  // Enhanced file validation
  const validateFile = useCallback((file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!file) {
      throw new Error("No file provided");
    }

    if (!validTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type "${file.type}". Please upload JPEG, PNG, or WebP images.`
      );
    }

    if (file.size > maxSize) {
      throw new Error(
        `File "${file.name}" is too large (${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB). Please upload images smaller than 10MB.`
      );
    }

    return true;
  }, []);

  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);

      if (dragCounter <= 1) {
        setIsDragActive(false);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  // Handle file selection (both drag & drop and click)
  const handleFileSelection = useCallback(
    (files) => {
      if (files.length === 0) return;

      setUploadErrors({});

      // Count current valid images
      const currentValidImages = uploadedImageUrls.filter(
        (url) => url && url.trim() !== ""
      ).length;
      const availableSlots = MAX_IMAGES - currentValidImages;

      if (files.length > availableSlots) {
        toast({
          title: "Too many files",
          description: `You can only upload ${availableSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`,
          variant: "destructive",
        });
        return;
      }

      // Validate each file
      const validFiles = [];
      const invalidFiles = [];

      files.forEach((file) => {
        try {
          validateFile(file);
          validFiles.push(file);
        } catch (error) {
          invalidFiles.push({ file: file.name, error: error.message });
        }
      });

      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid files detected",
          description: `${invalidFiles.length} file(s) were skipped due to validation errors.`,
          variant: "destructive",
        });
      }

      if (validFiles.length === 0) {
        return;
      }

      // Find empty slots and add files
      const newImageFiles = [...imageFiles];
      const newLoadingStates = [...imageLoadingStates];
      let fileIndex = 0;

      for (let i = 0; i < MAX_IMAGES && fileIndex < validFiles.length; i++) {
        if (
          !newImageFiles[i] &&
          (!uploadedImageUrls[i] || uploadedImageUrls[i].trim() === "")
        ) {
          newImageFiles[i] = validFiles[fileIndex];
          newLoadingStates[i] = false;
          fileIndex++;
        }
      }

      setImageFiles(newImageFiles);
      setImageLoadingStates(newLoadingStates);

      toast({
        title: "Files ready! 🔥",
        description: `${validFiles.length} file(s) ready for upload.`,
      });
    },
    [
      imageFiles,
      imageLoadingStates,
      uploadedImageUrls,
      setImageFiles,
      setImageLoadingStates,
      validateFile,
      toast,
    ]
  );

  // Handle click upload
  const handleFileInputChange = useCallback(
    (event) => {
      const files = Array.from(event.target.files || []);
      handleFileSelection(files);

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [handleFileSelection]
  );

  // Remove image function
  const handleRemoveImage = useCallback(
    (index) => {
      const newImageFiles = [...imageFiles];
      const newUploadedUrls = [...uploadedImageUrls];
      const newLoadingStates = [...imageLoadingStates];

      // Clear the slot
      newImageFiles[index] = null;
      newUploadedUrls[index] = "";
      newLoadingStates[index] = false;

      setImageFiles(newImageFiles);
      setUploadedImageUrls(newUploadedUrls);
      setImageLoadingStates(newLoadingStates);

      // Clear any errors for this index
      setUploadErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });

      // Update form data with valid URLs only
      if (setFormData) {
        const validUrls = newUploadedUrls.filter(
          (url) => url && url.trim() !== ""
        );
        setFormData((prev) => ({
          ...prev,
          image: validUrls,
        }));
      }

      toast({
        title: "Image removed 🗑️",
        description: "Image has been removed from the product.",
      });
    },
    [
      imageFiles,
      uploadedImageUrls,
      imageLoadingStates,
      setImageFiles,
      setUploadedImageUrls,
      setImageLoadingStates,
      setFormData,
      toast,
    ]
  );

  // Upload function
  const uploadImageToCloudinary = useCallback(
    async (file, index, isRetry = false) => {
      if (!file) return;

      const currentRetry = retryCount[index] || 0;

      setUploadErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });

      const newLoadingStates = [...imageLoadingStates];
      newLoadingStates[index] = true;
      setImageLoadingStates(newLoadingStates);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN_UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
          }
        );

        if (response?.data?.success && response.data?.imageUrl) {
          const newUploadedUrls = [...uploadedImageUrls];
          newUploadedUrls[index] = response.data.imageUrl;
          setUploadedImageUrls(newUploadedUrls);

          const newImageFiles = [...imageFiles];
          newImageFiles[index] = null;
          setImageFiles(newImageFiles);

          setRetryCount((prev) => {
            const newCount = { ...prev };
            delete newCount[index];
            return newCount;
          });

          if (setFormData) {
            const validUrls = newUploadedUrls.filter(
              (url) => url && url.trim() !== ""
            );
            setFormData((prev) => ({
              ...prev,
              image: validUrls,
            }));
          }

          toast({
            title: "Upload successful! ✅",
            description: `Image ${index + 1} uploaded successfully.`,
          });
        } else {
          throw new Error(
            response?.data?.message || "Upload failed - no image URL returned"
          );
        }
      } catch (error) {
        let errorMessage = "Upload failed";
        let canRetry = false;

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          switch (status) {
            case 413:
              errorMessage = "File too large. Choose a smaller image.";
              break;
            case 400:
              errorMessage = data?.message || "Invalid file format";
              break;
            case 401:
              errorMessage = "Authentication required. Please login again.";
              break;
            default:
              if (status >= 500) {
                errorMessage = "Server error. Please try again.";
                canRetry = true;
              } else {
                errorMessage = data?.message || `Server error (${status})`;
                canRetry = status !== 400;
              }
          }
        } else {
          errorMessage = "Network error. Check your connection.";
          canRetry = true;
        }

        setUploadErrors((prev) => ({
          ...prev,
          [index]: { message: errorMessage, canRetry },
        }));

        if (canRetry && currentRetry < MAX_RETRIES) {
          toast({
            title: `Upload failed (Attempt ${currentRetry + 1}/${
              MAX_RETRIES + 1
            })`,
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Upload failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        const finalLoadingStates = [...imageLoadingStates];
        finalLoadingStates[index] = false;
        setImageLoadingStates(finalLoadingStates);
      }
    },
    [
      imageLoadingStates,
      uploadedImageUrls,
      imageFiles,
      retryCount,
      setImageLoadingStates,
      setUploadedImageUrls,
      setImageFiles,
      setFormData,
      toast,
    ]
  );

  // Retry upload
  const retryUpload = useCallback(
    (index) => {
      const file = imageFiles[index];
      if (file) {
        setRetryCount((prev) => ({
          ...prev,
          [index]: (prev[index] || 0) + 1,
        }));
        uploadImageToCloudinary(file, index, true);
      }
    },
    [imageFiles, uploadImageToCloudinary]
  );

  // Auto-upload when files are added
  useEffect(() => {
    imageFiles.forEach((file, index) => {
      if (
        file &&
        !uploadedImageUrls[index] &&
        !imageLoadingStates[index] &&
        !uploadErrors[index]
      ) {
        uploadImageToCloudinary(file, index);
      }
    });
  }, [
    imageFiles,
    uploadImageToCloudinary,
    uploadedImageUrls,
    imageLoadingStates,
    uploadErrors,
  ]);

  // Get all images for display (uploaded URLs + file previews)
  const allImages = [];
  for (let i = 0; i < MAX_IMAGES; i++) {
    if (uploadedImageUrls[i] && uploadedImageUrls[i].trim() !== "") {
      allImages.push(uploadedImageUrls[i]);
    } else if (imageFiles[i]) {
      allImages.push(imageFiles[i]);
    } else {
      allImages.push(null);
    }
  }

  const uploadedCount = uploadedImageUrls.filter(
    (url) => url && url.trim() !== ""
  ).length;
  const pendingCount = imageFiles.filter((file) => file).length;
  const errorCount = Object.keys(uploadErrors).length;
  const hasImages = allImages.some((img) => img !== null);

  return (
    <div className="w-full mt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product Images</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode
              ? "Update product images (existing images will be preserved)"
              : `Upload up to ${MAX_IMAGES} high-quality images`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {uploadedCount}/{MAX_IMAGES} uploaded
            {pendingCount > 0 && `, ${pendingCount} pending`}
            {errorCount > 0 && `, ${errorCount} errors`}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploadedCount >= MAX_IMAGES}
      />

      {/* Main Drop Zone */}
      <div
        className="w-full relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <motion.div
          whileHover="animate"
          className={cn(
            "p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden",
            "border-2 border-dashed transition-all duration-300",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>

          <div className="flex flex-col items-center justify-center relative z-10">
            <AnimatePresence>
              {isDragActive ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-lg font-bold text-blue-700 mb-2">
                    Drop your images here! 🎯
                  </p>
                  <p className="text-blue-600">Release to add your images</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <UploadCloudIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    {uploadedCount === 0
                      ? "Upload Product Images"
                      : "Add More Images"}
                  </p>
                  <p className="text-gray-500">
                    Drag & drop your files here or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports: JPEG, PNG, WebP • Max: 10MB each
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Image Preview Grid */}
        {hasImages && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Image Preview
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {allImages.map((image, index) => {
                if (!image) return null;

                return (
                  <ImageCard
                    key={`image-${index}-${
                      typeof image === "string" ? "url" : "file"
                    }`}
                    image={image}
                    index={index}
                    onRemove={handleRemoveImage}
                    isLoading={imageLoadingStates[index]}
                    error={uploadErrors[index]}
                    onRetry={retryUpload}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploadedCount >= MAX_IMAGES}
          className="flex-1 h-12"
        >
          <ImageIcon className="w-5 h-5 mr-2" />
          {uploadedCount === 0
            ? "Browse Images"
            : `Add More (${MAX_IMAGES - uploadedCount} slots left)`}
        </Button>

        {hasImages && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              // Clear all images
              setImageFiles(new Array(MAX_IMAGES).fill(null));
              setUploadedImageUrls(new Array(MAX_IMAGES).fill(""));
              setImageLoadingStates(new Array(MAX_IMAGES).fill(false));
              setUploadErrors({});

              if (setFormData) {
                setFormData((prev) => ({ ...prev, image: [] }));
              }

              toast({
                title: "All images cleared 🧹",
                description: "All images have been removed.",
              });
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {isEditMode && uploadedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">Edit Mode Active ✏️</p>
              <p className="text-blue-700 text-sm mt-1">
                {uploadedCount} image(s) loaded. You can add more images or
                remove existing ones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Tips */}
      {uploadedCount === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <FileImage className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Pro Tips 💡</p>
              <ul className="text-gray-700 text-sm mt-2 space-y-1">
                <li>• First image becomes your main product image</li>
                <li>
                  • Use high-resolution images (min 800x800px recommended)
                </li>
                <li>• Show different angles and details</li>
                <li>• Drag multiple files at once for faster upload</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
