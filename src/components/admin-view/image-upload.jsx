// src/components/admin-view/image-upload.jsx - FIXED EDIT MODE 🔧

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { API_ENDPOINTS } from "../../config/api";
import apiClient from "../../utils/apiClient";
import {
  UploadCloudIcon,
  XIcon,
  ImageIcon,
  AlertCircle,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  imageLoadingStates = [],
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingStates,
  isEditMode = false,
  setFormData,
  existingImages = [], // ✅ NEW: Pass existing images from edit mode
}) {
  const inputRef = useRef(null);
  const [uploadErrors, setUploadErrors] = useState({});
  const [retryCount, setRetryCount] = useState({});
  const { toast } = useToast();
  const MAX_IMAGES = 5;
  const MAX_RETRIES = 3;

  // ✅ CRITICAL FIX: Initialize with existing images in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      existingImages &&
      existingImages.length > 0 &&
      uploadedImageUrls.length === 0
    ) {

      // Ensure we have valid image URLs
      const validExistingImages = existingImages.filter(
        (img) =>
          img &&
          typeof img === "string" &&
          img.trim() !== "" &&
          (img.startsWith("http") || img.startsWith("data:"))
      );

      if (validExistingImages.length > 0) {
        // Fill uploadedImageUrls with existing images + empty slots
        const initialUrls = [...validExistingImages];
        while (initialUrls.length < MAX_IMAGES) {
          initialUrls.push("");
        }

        setUploadedImageUrls(initialUrls);

        // Initialize loading states
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

  // ✅ FIXED: Enhanced file validation with better error messages
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

  // ✅ FIXED: Handle file selection with existing images consideration
  const handleImageFilesChange = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files || []);

      if (selectedFiles.length === 0) return;

      // Clear previous errors
      setUploadErrors({});

      // Count current valid images
      const currentValidImages = uploadedImageUrls.filter(
        (url) => url && url.trim() !== ""
      ).length;
      const availableSlots = MAX_IMAGES - currentValidImages;

      if (selectedFiles.length > availableSlots) {
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

      selectedFiles.forEach((file) => {
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
        console.error("Invalid files:", invalidFiles);
      }

      if (validFiles.length === 0) {
        return;
      }

      // ✅ FIXED: Find empty slots and add files (respect existing images)
      const newImageFiles = [...imageFiles];
      const newLoadingStates = [...imageLoadingStates];
      let fileIndex = 0;

      for (let i = 0; i < MAX_IMAGES && fileIndex < validFiles.length; i++) {
        // Only add to slots that don't have uploaded images
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

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      toast({
        title: "Files selected",
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

  // ✅ FIXED: Remove image function that handles both new uploads and existing images
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

      // ✅ CRITICAL: Update form data with valid URLs only
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
        title: "Image removed",
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

  // ✅ FIXED: Upload function with better error handling
  const uploadImageToCloudinary = useCallback(
    async (file, index, isRetry = false) => {
      if (!file) return;

      const currentRetry = retryCount[index] || 0;

      // Clear any previous errors for this index
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
            timeout: 30000, // 30 second timeout
          }
        );

        if (response?.data?.success && response.data?.imageUrl) {
          const newUploadedUrls = [...uploadedImageUrls];
          newUploadedUrls[index] = response.data.imageUrl;
          setUploadedImageUrls(newUploadedUrls);

          // Clear the file from imageFiles since it's now uploaded
          const newImageFiles = [...imageFiles];
          newImageFiles[index] = null;
          setImageFiles(newImageFiles);

          // Reset retry count for this index
          setRetryCount((prev) => {
            const newCount = { ...prev };
            delete newCount[index];
            return newCount;
          });

          // ✅ CRITICAL: Update form data with all valid URLs
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
        console.error(`❌ Upload error for image ${index + 1}:`, error);

        let errorMessage = "Upload failed";
        let canRetry = false;

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          switch (status) {
            case 413:
              errorMessage = "File too large. Please choose a smaller image.";
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
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
          canRetry = true;
        } else {
          errorMessage = error.message || "Unknown error occurred";
          canRetry = true;
        }

        // Store error for this index
        setUploadErrors((prev) => ({
          ...prev,
          [index]: { message: errorMessage, canRetry },
        }));

        // Show retry option for network/server errors
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

  // Auto-upload when files are added (but not in edit mode for existing images)
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

  const uploadedCount = uploadedImageUrls.filter(
    (url) => url && url.trim() !== ""
  ).length;
  const pendingCount = imageFiles.filter((file) => file).length;
  const errorCount = Object.keys(uploadErrors).length;

  return (
    <div className="w-full mt-4 space-y-6">
      {/* Header with better status display */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Images</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode
              ? "Update product images (existing images will be preserved)"
              : `Upload up to ${MAX_IMAGES} high-quality images`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            {uploadedCount}/{MAX_IMAGES} uploaded
            {pendingCount > 0 && `, ${pendingCount} pending`}
            {errorCount > 0 && `, ${errorCount} errors`}
          </div>
        </div>
      </div>

      {/* File Input */}
      <input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageFilesChange}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        disabled={uploadedCount >= MAX_IMAGES}
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: MAX_IMAGES }, (_, index) => {
          const hasImage =
            uploadedImageUrls[index] && uploadedImageUrls[index].trim() !== "";
          const hasFile = imageFiles[index];
          const isLoading = imageLoadingStates[index];
          const error = uploadErrors[index];

          return (
            <div
              key={index}
              className={`
                relative aspect-square border-2 border-dashed rounded-xl
                transition-all duration-200 ease-in-out
                ${
                  hasImage || hasFile
                    ? "border-solid border-gray-200"
                    : "border-gray-300"
                }
                ${error ? "border-red-300 bg-red-50" : ""}
                ${
                  !hasImage && !hasFile
                    ? "hover:border-gray-400 hover:bg-gray-50"
                    : ""
                }
              `}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-600">Uploading...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl p-2">
                  <div className="text-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-red-600 mb-2">{error.message}</p>
                    {error.canRetry && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(index)}
                        className="text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              ) : hasImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={uploadedImageUrls[index]}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-500/90 hover:bg-red-600"
                      title="Remove image"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ) : hasFile ? (
                <div className="relative w-full h-full">
                  <img
                    src={URL.createObjectURL(imageFiles[index])}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-pulse bg-blue-500 h-6 w-6 rounded-full mx-auto mb-1"></div>
                      <p className="text-xs text-gray-600">
                        Ready to upload...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 rounded-xl"
                >
                  {index === 0 && uploadedCount === 0 ? (
                    <>
                      <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center">
                        Main Image
                      </span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        Click to add
                      </span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center">
                        Add Image
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploadedCount >= MAX_IMAGES}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {uploadedCount === 0
            ? "Choose Images"
            : `Add More Images (${MAX_IMAGES - uploadedCount} slots left)`}
        </Button>
      </div>

      {/* Status Messages */}
      {isEditMode && uploadedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">Edit Mode Active</p>
              <p className="text-blue-700 text-sm mt-1">
                {uploadedCount} image(s) loaded. You can add more images or
                remove existing ones.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
